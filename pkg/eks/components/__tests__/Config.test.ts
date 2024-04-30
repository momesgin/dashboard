/* eslint-disable jest/no-mocks-import */
import flushPromises from 'flush-promises';
import { shallowMount, Wrapper } from '@vue/test-utils';
import { EKSConfig } from 'types';
import Config from '@pkg/eks/components/Config.vue';
import listKeysResponseData from '../__mocks__/listKeys';
import describeAddonVersionsResponseData from '../__mocks__/describeAddonVersions';

const mockedValidationMixin = {
  computed: {
    fvFormIsValid:                jest.fn(),
    type:                         jest.fn(),
    fvUnreportedValidationErrors: jest.fn(),
  },
  methods: { fvGetAndReportPathRules: jest.fn() }
};

const mockedStore = (versionSetting: any) => {
  return {
    getters: {
      'i18n/t':               (text: string) => text,
      t:                      (text: string) => text,
      currentStore:           () => 'current_store',
      'management/schemaFor': jest.fn(),
      'rancher/create':       () => {},
      'management/byId':      () => {
        return versionSetting;
      },
    },
    dispatch: () => {
      return {
        listKeys: () => {
          return listKeysResponseData;
        },
        describeAddonVersions: () => {
          return describeAddonVersionsResponseData;
        }

      };
    }
  };
};

const mockedRoute = { query: {} };

const requiredSetup = (versionSetting = { value: '<=1.27.x' }) => {
  return {
    mixins: [mockedValidationMixin],
    mocks:  {
      $store:      mockedStore(versionSetting),
      $route:      mockedRoute,
      $fetchState: {},
    }
  };
};

const setCredential = async(wrapper :Wrapper<any>, config = {} as EKSConfig) => {
  config.amazonCredentialSecret = 'foo';
  config.region = 'bar';
  wrapper.setData({ config });
  await flushPromises();
};

describe('eKS K8s configuration', () => {
  it('should load eks versions and kms keys when the credential or region is set', async() => {
    const setup = requiredSetup();
    const spy = jest.spyOn(setup.mocks.$store, 'dispatch');

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    expect(wrapper.exists()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);
    await setCredential(wrapper);
    expect(spy).toHaveBeenCalledWith('aws/eks', { cloudCredentialId: 'foo', region: 'bar' });
    expect(spy).toHaveBeenCalledWith('aws/kms', { cloudCredentialId: 'foo', region: 'bar' });
  });

  it('should re-load eks versions and kms keys when the region is changed', async() => {
    const setup = requiredSetup();
    const spy = jest.spyOn(setup.mocks.$store, 'dispatch');

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    expect(wrapper.exists()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);
    await setCredential(wrapper);
    expect(spy).toHaveBeenCalledTimes(4);

    wrapper.setData({ config: { amazonCredentialSecret: 'foo', region: 'rab' } });
    await flushPromises();
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy).toHaveBeenCalledWith('aws/eks', { cloudCredentialId: 'foo', region: 'rab' });
    expect(spy).toHaveBeenCalledWith('aws/kms', { cloudCredentialId: 'foo', region: 'rab' });
  });

  it('should re-load eks versions and kms keys when the credential is changed', async() => {
    const setup = requiredSetup();
    const spy = jest.spyOn(setup.mocks.$store, 'dispatch');

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    expect(spy).toHaveBeenCalledTimes(0);
    await setCredential(wrapper);
    expect(spy).toHaveBeenCalledTimes(4);

    wrapper.setData({ config: { amazonCredentialSecret: 'oof', region: 'bar' } });
    await flushPromises();
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy).toHaveBeenCalledWith('aws/eks', { cloudCredentialId: 'oof', region: 'bar' });
    expect(spy).toHaveBeenCalledWith('aws/kms', { cloudCredentialId: 'oof', region: 'bar' });
  });

  it('should show an input for a KMS key when the encrypt secrets checkbox is checked', async() => {
    const setup = requiredSetup();

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    await setCredential(wrapper);
    expect(wrapper.exists()).toBe(true);

    let kmsDropdown = wrapper.find('[data-testid="eks-kms-dropdown"]');

    expect(kmsDropdown.exists()).toBe(false);

    wrapper.setData({ encryptSecrets: true, canReadKms: true });
    await wrapper.vm.$nextTick();
    kmsDropdown = wrapper.find('[data-testid="eks-kms-dropdown"]');

    expect(kmsDropdown.exists()).toBe(true);
  });

  it('should show an input for service role if the custom service role radio option is selected', async() => {
    const setup = requiredSetup();

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    await setCredential(wrapper);
    expect(wrapper.exists()).toBe(true);
    wrapper.setData({ customServiceRole: false });
    let serviceRoleDropdown = wrapper.find('[data-testid="eks-service-role-dropdown"]');

    expect(serviceRoleDropdown.exists()).toBe(false);
    wrapper.setData({ customServiceRole: true });
    serviceRoleDropdown = wrapper.find('[data-testid="eks-service-role-dropdown"]');

    expect(serviceRoleDropdown.exists()).toBe(false);
  });

  it('should not allow kubernetes downgrades', async() => {
    const setup = requiredSetup();

    const wrapper = shallowMount(Config, {
      propsData: {
        config:          { amazonCredentialSecret: '', region: '' },
        originalVersion: '1.26'
      },
      ...setup
    });

    await setCredential(wrapper);
    expect(wrapper.exists()).toBe(true);

    let versionOptions = wrapper.find('[data-testid="eks-version-dropdown"]').vm.options;

    expect(versionOptions).not.toContain('1.25');
    wrapper.setProps({ originalVersion: '1.27' });
    await wrapper.vm.$nextTick();
    versionOptions = wrapper.find('[data-testid="eks-version-dropdown"]').vm.options;
    expect(versionOptions).not.toContain('1.26');
  });

  it.each([
    ['>1.24', ['1.29', '1.28', '1.27', '1.26', '1.25']],
    ['>1.26', ['1.29', '1.28', '1.27']]
  ])('should only show kubernetes versions within the supported version range global setting', async(versionSettingValue, expectedVersions) => {
    const setup = requiredSetup({ value: versionSettingValue });

    const wrapper = shallowMount(Config, { propsData: { config: { amazonCredentialSecret: '', region: '' } }, ...setup });

    await setCredential(wrapper);
    expect(wrapper.exists()).toBe(true);
    const versionOptions = wrapper.find('[data-testid="eks-version-dropdown"]').vm.options;

    expect(versionOptions).toStrictEqual(expectedVersions);
  });
});
