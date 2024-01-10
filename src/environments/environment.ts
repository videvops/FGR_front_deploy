// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  googleMapsApiKey: '',
    apiURL: 'https://backendrefic.azurewebsites.net/'
  //apiURL: 'https://fgr-back-deploy.azurewebsites.net/'
};

export const environmentPrometheusApi = {
  production: false,
  googleMapsApiKey: '',
  apiURL: 'http://164.56.1.19/PrometheusWebApiPruebas/'
};
