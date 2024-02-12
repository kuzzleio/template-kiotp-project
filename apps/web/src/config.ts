import { KuzzleProtocol } from 'vue-plugin-kuzzle';

export default {
  backends: {
    main: {
      host: 'api-main-<projectName>.paas.kuzzle.io',
      protocol: KuzzleProtocol.WEBSOCKET,
      options: {
        port: 443,
        sslConnection: true,
      },
    },
    uat: {
      host: 'api-main-<projectName>.paas.kuzzle.io',
      protocol: KuzzleProtocol.WEBSOCKET,
      options: {
        port: 443,
        sslConnection: true,
      },
    },
    local: {
      host: 'localhost',
      protocol: KuzzleProtocol.WEBSOCKET,
      options: {
        port: 7512,
        sslConnection: false,
      },
    },
  },
  i18n: {
    locales: {
      en: 'English',
      fr: 'Français',
    },
  },
  maps: {
    tileProviders: {
      plan: {
        visible: true,
        attribution:
          '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        options: {
          maxNativeZoom: 18,
          style: 'normal',
          format: 'image/png',
          apikey: 'cartes',
        },
      },
      satelite: {
        visible: false,
        attribution:
          '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        options: {
          maxNativeZoom: 19,
          style: 'normal',
          format: 'image/jpeg',
          apikey: 'ortho',
        },
      },
      poi: {
        visible: false,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
  },
  customizations: {
    index: 'customizations',
    collection: 'config',
  },
  authentication: {
    type: 'keycloak',
    clientConfig: {
      authority: 'https://sso.paas.kuzzle.io/realms/<projectName>',
      client_id: 'kiotp-front',
      response_type: 'code',
      scope: 'openid',
    },
  },
};
