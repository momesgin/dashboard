<script>
import CruResource from '@shell/components/CruResource';
import createEditView from '@shell/mixins/create-edit-view';
import formValidation from '@shell/mixins/form-validation';
import { LabeledInput } from '@components/Form/LabeledInput';
import UnitInput from '@shell/components/form/UnitInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import { Banner } from '@components/Banner';
import { RadioGroup } from '@components/Form/Radio';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import Loading from '@shell/components/Loading';
import S3 from '@shell/chart/rancher-backup/S3';
import { mapGetters } from 'vuex';
import { SECRET, BACKUP_RESTORE, CATALOG } from '@shell/config/types';
import { allHash } from '@shell/utils/promise';
import { NAMESPACE, _VIEW } from '@shell/config/query-params';
import { sortBy } from '@shell/utils/sort';
import { get } from '@shell/utils/object';
import { formatEncryptionSecretNames } from '@shell/utils/formatter';
import { FilterArgs, PaginationParamFilter } from '@shell/types/store/pagination.types';
import { SECRET_TYPES } from '@shell/config/secret';

export default {

  components: {
    CruResource,
    UnitInput,
    LabeledInput,
    LabeledSelect,
    RadioGroup,
    NameNsDescription,
    Banner,
    Loading,
    S3,
  },
  mixins: [createEditView, formValidation],

  props: {
    value: {
      type:    Object,
      default: () => {
        return {};
      }
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },

  async fetch() {
    const hash = await allHash({
      catalog:     this.$store.dispatch('catalog/load'),
      resourceSet: this.$store.dispatch('cluster/find', { type: BACKUP_RESTORE.RESOURCE_SET, id: this.value?.spec?.resourceSetName || 'rancher-resource-set' }),
      apps:        this.$store.dispatch('cluster/findAll', { type: CATALOG.APP })
    });

    this.apps = hash.apps;
    this.resourceSet = hash.resourceSet;

    const BRORelease = this.apps.filter((release) => get(release, 'spec.name') === 'rancher-backup')[0];

    this.chartNamespace = BRORelease?.spec.namespace || '';

    if (this.$store.getters[`cluster/paginationEnabled`](SECRET)) {
      const findPageArgs = { // Of type ActionFindPageArgs
        namespaced: this.chartNamespace,
        pagination: new FilterArgs({
          filters: PaginationParamFilter.createSingleField({
            field: 'metadata.fields.1',
            value: SECRET_TYPES.OPAQUE
          })
        }),
      };

      // Do a one time request to get these type of secrets.... and there's a control on this page that will fetch and cache secrets
      const url = this.$store.getters[`cluster/urlFor`](SECRET, null, findPageArgs);
      const res = await this.$store.dispatch(`cluster/request`, { url });

      this.secrets = res?.data || [];
    } else {
      this.secrets = await this.$store.dispatch('cluster/findAll', { type: SECRET });
    }
  },

  data() {
    if (!this.value.spec) {
      this.value['spec'] = { retentionCount: 10 };
    }
    let s3 = {};
    let useEncryption = false;
    let setSchedule = false;
    let storageSource = 'useDefault';

    if (this.value.spec.encryptionConfigSecretName) {
      useEncryption = true;
    }

    if (this.value.spec.schedule) {
      setSchedule = true;
    }

    if (this.value?.spec?.storageLocation?.s3) {
      storageSource = 'configureS3';
      s3 = this.value.spec.storageLocation.s3;
    }

    return {
      secrets:        [],
      resourceSet:    null,
      s3,
      storageSource,
      useEncryption,
      apps:           [],
      setSchedule,
      name:           this.value?.metadata?.name,
      fvFormRuleSets: [{
        path: 'metadata.name', rules: ['dnsLabel', 'noUpperCase'], translationKey: 'nameNsDescription.name.label'
      }],
      chartNamespace: null,
    };
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },

    encryptionSecretNames() {
      return formatEncryptionSecretNames(this.secrets, this.chartNamespace);
    },

    storageOptions() {
      const options = ['useDefault', 'configureS3'];
      const labels = [this.t('backupRestoreOperator.storageSource.useDefault'), this.t('backupRestoreOperator.storageSource.configureS3')];

      return { options, labels };
    },

    encryptionOptions() {
      const options = [false, true];
      const labels = [this.t('backupRestoreOperator.encryptionConfigName.options.none'), this.t('backupRestoreOperator.encryptionConfigName.options.secret', {}, true)];

      return { options, labels };
    },

    namespaces() {
      const choices = this.$store.getters['cluster/all'](NAMESPACE);
      const out = sortBy(choices.map((obj) => {
        return {
          label: obj.nameDisplay,
          value: obj.id,
        };
      }), 'label');

      return out;
    },

    validated() {
      return !!this.name && (!this.useEncryption || !!this.value?.spec?.encryptionConfigSecretName) && this.fvFormIsValid;
    },

    ...mapGetters({ t: 'i18n/t' })
  },

  watch: {
    storageSource(neu) {
      if (neu === 'useDefault') {
        delete this.value.spec.storageLocation;
      } else {
        this.value.spec['storageLocation'] = { s3: this.s3 };
      }
    },

    resourceSet(neu) {
      if (neu?.metadata?.name) {
        this.value.spec['resourceSetName'] = neu?.metadata?.name;
      }
    },

    setSchedule(neu) {
      if (!neu) {
        delete this.value.spec.schedule;
        delete this.value.spec.retentionCount;
      }
    },

    useEncryption(neu) {
      if (!neu) {
        this.value.spec.encryptionConfigSecretName = '';
      }
    }
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <CruResource
    v-else
    :validation-passed="validated"
    :done-route="doneRoute"
    :resource="value"
    :mode="mode"
    :errors="fvUnreportedValidationErrors"
    @finish="save"
  >
    <NameNsDescription
      :mode="mode"
      :value="value"
      :namespaced="false"
      :rules="{name: fvGetAndReportPathRules('metadata.name')}"
      @change="name=value.metadata.name"
    />
    <template v-if="!!resourceSet">
      <div class="bordered-section">
        <RadioGroup
          v-model:value="setSchedule"
          :mode="mode"
          :label="t('backupRestoreOperator.schedule.label')"
          name="setSchedule"
          :options="[false, true]"
          :labels="[t('backupRestoreOperator.schedule.options.disabled'), t('backupRestoreOperator.schedule.options.enabled')]"
        />
        <div
          v-if="setSchedule"
          class="row mt-10 mb-10"
        >
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.schedule"
              type="cron"
              :mode="mode"
              :label="t('backupRestoreOperator.schedule.label')"
              :placeholder="t('backupRestoreOperator.schedule.placeholder')"
            />
          </div>
          <div class="col span-6">
            <UnitInput
              v-model:value="value.spec.retentionCount"
              :suffix="t('backupRestoreOperator.retentionCount.units', {count: value.spec.retentionCount || 0})"
              :mode="mode"
              :label="t('backupRestoreOperator.retentionCount.label')"
            />
          </div>
        </div>
      </div>

      <div class="bordered-section">
        <div class="row">
          <div class="col span-12">
            <RadioGroup
              v-model:value="useEncryption"
              name="useEncryption"
              :label="t('backupRestoreOperator.encryption')"
              :options="encryptionOptions.options"
              :labels="encryptionOptions.labels"
              :mode="mode"
            />
          </div>
        </div>
        <div
          v-if="useEncryption"
          :style="{'align-items':'center'}"
          class="row mt-10"
        >
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.encryptionConfigSecretName"
              :tooltip="t('backupRestoreOperator.encryptionConfigName.backuptip', { ns: chartNamespace}, true)"
              :hover-tooltip="true"
              :mode="mode"
              :options="encryptionSecretNames"
              :label="t('backupRestoreOperator.encryptionConfigName.label')"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col span-12">
          <span
            v-if="isView"
            class="text-label"
          >{{ t('backupRestoreOperator.s3.titles.location') }}</span>
          <RadioGroup
            v-else
            v-model:value="storageSource"
            name="storageSource"
            :label="t('backupRestoreOperator.s3.titles.location')"
            :options="storageOptions.options"
            :labels="storageOptions.labels"
            :mode="mode"
          />
        </div>
      </div>

      <template v-if="storageSource !== 'useDefault'">
        <div class="row mt-10">
          <div class="col span-12">
            <S3
              :value="s3"
              :mode="mode"
            />
          </div>
        </div>
      </template>
      <template v-else-if="isView">
        <span>{{ t('generic.default') }}</span>
      </template>
    </template>
    <Banner
      v-else
      color="error"
    >
      <span v-clean-html="t('backupRestoreOperator.noResourceSet')" />
    </Banner>
  </CruResource>
</template>
