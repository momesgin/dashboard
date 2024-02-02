import ClusterManagerCreateRke2CustomPagePo from "@/cypress/e2e/po/edit/provisioning.cattle.io.cluster/create/cluster-create-rke2-custom.po";
import { machineSelectorConfigPayload, registriesWithSecretPayload } from "@/cypress/e2e/blueprints/manager/registries-rke2-payload";

const registryHost = "docker.io";
const registryAuthHost = "a.registry.com";
const clusterName = `test-cluster-${Math.random().toString(36).substr(2, 6)}`;

describe("Registries for RKE2", { tags: ["@manager", "@adminUser"] }, () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should send the correct payload to the server", () => {
    const createCustomClusterPage = new ClusterManagerCreateRke2CustomPagePo();

    createCustomClusterPage.goToCustomClusterCreation();
    createCustomClusterPage.waitForPage();

    // intercepts
    cy.intercept("POST", "v1/provisioning.cattle.io.clusters").as("customRKE2ClusterCreation");
    cy.intercept("POST", "v1/secrets/fleet-default").as("registrySecretCreation");

    // we should be on the custom cluster creation screen (starts on cluster agent tab as per url of goTo)
    createCustomClusterPage.title().should("contain", "Create Custom");
    // cluster name
    createCustomClusterPage.nameNsDescription().name().set(clusterName);
    // navigate to Registries tab
    createCustomClusterPage.registries().clickTab("#registry");
    // enable registry
    createCustomClusterPage.registries().enableRegistryCheckbox().set();
    // add host
    createCustomClusterPage.registries().addRegistryHost(registryHost);
    // click show advanced
    createCustomClusterPage.registries().clickShowAdvanced();
    // scroll down to registry auth
    createCustomClusterPage.registries().registryAuthHost().self().scrollIntoView();
    // add url
    createCustomClusterPage.registries().addRegistryAuthHost(registryAuthHost);
    // create basic secret
    createCustomClusterPage.registries().registryAuthSelectOrCreate().createBasicAuth("test-user", "test-pass");
    // save
    createCustomClusterPage.create();

    let registrySecret;

    // need to do a wait to make sure intercept doesn't fail on cy.wait for request
    // ci/cd pipelines are notoriously slow... let's wait longer than usual
    cy.wait("@registrySecretCreation", { requestTimeout: 10000 }).then((req) => {
      expect(req.response?.statusCode).to.equal(201);
      registrySecret = req.response?.body?.metadata?.name;
    });
    cy.wait("@customRKE2ClusterCreation", { requestTimeout: 10000 }).then((req) => {
      expect(req.response?.statusCode).to.equal(201);
      expect(req.request?.body?.spec.rkeConfig.machineSelectorConfig).to.deep.equal(machineSelectorConfigPayload(registryHost));
      expect(req.request?.body?.spec.rkeConfig.registries).to.deep.equal(
        registriesWithSecretPayload(
          registryAuthHost,
          registrySecret
        ));
      expect(req.request?.body?.spec.rkeConfig.registries.configs[registryHost]).to.equal(undefined);
    });
  });
});