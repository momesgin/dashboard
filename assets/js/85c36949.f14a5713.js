"use strict";(self.webpackChunkrancher_ui_devkit=self.webpackChunkrancher_ui_devkit||[]).push([[6583],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>u});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),m=d(n),u=o,k=m["".concat(p,".").concat(u)]||m[u]||c[u]||r;return n?a.createElement(k,l(l({ref:t},s),{},{components:n})):a.createElement(k,l({ref:t},s))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,l=new Array(r);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var d=2;d<r;d++)l[d]=n[d];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6677:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>c,frontMatter:()=>r,metadata:()=>i,toc:()=>d});var a=n(7462),o=(n(7294),n(3905));const r={},l="addPanel",i={unversionedId:"extensions/extension-api-methods/add-panel",id:"extensions/extension-api-methods/add-panel",title:"addPanel",description:"(Rancher version v2.7.2)",source:"@site/docs/extensions/extension-api-methods/add-panel.md",sourceDirName:"extensions/extension-api-methods",slug:"/extensions/extension-api-methods/add-panel",permalink:"/dashboard/extensions/extension-api-methods/add-panel",draft:!1,tags:[],version:"current",lastUpdatedAt:1678927517,formattedLastUpdatedAt:"Mar 16, 2023",frontMatter:{},sidebar:"mainSidebar",previous:{title:"addCard",permalink:"/dashboard/extensions/extension-api-methods/add-card"},next:{title:"addTab",permalink:"/dashboard/extensions/extension-api-methods/add-tab"}},p={},d=[{value:"<code>&#39;PanelLocation.DETAILS_MASTHEAD&#39;</code> options",id:"panellocationdetails_masthead-options",level:2},{value:"<code>&#39;PanelLocation.DETAIL_TOP&#39;</code> options",id:"panellocationdetail_top-options",level:2},{value:"<code>&#39;PanelLocation.RESOURCE_LIST&#39;</code> options",id:"panellocationresource_list-options",level:2}],s={toc:d};function c(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"addpanel"},"addPanel"),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"(Rancher version v2.7.2)")),(0,o.kt)("p",null,"This method adds a panel/content to the UI."),(0,o.kt)("p",null,"Method:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addPanel(where: String, when: LocationConfig, options: Object);\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Arguments")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"where")," string parameter admissable values for this method:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Key"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"PanelLocation.DETAILS_MASTHEAD")),(0,o.kt)("td",{parentName:"tr",align:null},"String"),(0,o.kt)("td",{parentName:"tr",align:null},"Location for a panel on the Details Masthead area of a Resource Detail page")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"PanelLocation.DETAIL_TOP")),(0,o.kt)("td",{parentName:"tr",align:null},"String"),(0,o.kt)("td",{parentName:"tr",align:null},"Location for a panel on the Detail Top area of a Resource Detail page")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"PanelLocation.RESOURCE_LIST")),(0,o.kt)("td",{parentName:"tr",align:null},"String"),(0,o.kt)("td",{parentName:"tr",align:null},"Location for a panel on a Resource List View page (above the table area)")))),(0,o.kt)("br",null),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"when")," Object admissable values:"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"LocationConfig")," as described above for the ",(0,o.kt)("a",{parentName:"p",href:"../extensions-api#locationconfig-object-definition-when"},"LocationConfig object"),"."),(0,o.kt)("br",null),(0,o.kt)("br",null),(0,o.kt)("h2",{id:"panellocationdetails_masthead-options"},(0,o.kt)("inlineCode",{parentName:"h2"},"'PanelLocation.DETAILS_MASTHEAD'")," options"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Details Masthead",src:n(5958).Z,width:"1511",height:"1001"})),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"options")," config object. Admissable parameters for the ",(0,o.kt)("inlineCode",{parentName:"p"},"options")," with ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.DETAILS_MASTHEAD'")," are:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Key"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"component")),(0,o.kt)("td",{parentName:"tr",align:null},"Function"),(0,o.kt)("td",{parentName:"tr",align:null},'Component to be rendered as content on the "detail view" Masthead component')))),(0,o.kt)("p",null,"Usage example for ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.DETAILS_MASTHEAD'"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addPanel(\n  PanelLocation.DETAILS_MASTHEAD\n  { resource: ['catalog.cattle.io.clusterrepo'] },\n  { component: () => import('./MastheadDetailsComponent.vue') }\n);\n")),(0,o.kt)("br",null),(0,o.kt)("br",null),(0,o.kt)("h2",{id:"panellocationdetail_top-options"},(0,o.kt)("inlineCode",{parentName:"h2"},"'PanelLocation.DETAIL_TOP'")," options"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"DetailTop",src:n(8886).Z,width:"1511",height:"1001"})),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"options")," config object. Admissable parameters for the ",(0,o.kt)("inlineCode",{parentName:"p"},"options")," with ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.DETAIL_TOP'")," are:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Key"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"component")),(0,o.kt)("td",{parentName:"tr",align:null},"Function"),(0,o.kt)("td",{parentName:"tr",align:null},'Component to be rendered as content on the "detail view" detailTop component')))),(0,o.kt)("p",null,"Usage example for ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.DETAIL_TOP'"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addPanel(\n  PanelLocation.DETAIL_TOP,\n  { resource: ['catalog.cattle.io.clusterrepo'] },\n  { component: () => import('./DetailTopComponent.vue') }\n);\n")),(0,o.kt)("br",null),(0,o.kt)("br",null),(0,o.kt)("h2",{id:"panellocationresource_list-options"},(0,o.kt)("inlineCode",{parentName:"h2"},"'PanelLocation.RESOURCE_LIST'")," options"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"List View",src:n(3365).Z,width:"1511",height:"1001"})),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"options")," config object. Admissable parameters for the ",(0,o.kt)("inlineCode",{parentName:"p"},"options")," with ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.RESOURCE_LIST'")," are:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Key"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"component")),(0,o.kt)("td",{parentName:"tr",align:null},"Function"),(0,o.kt)("td",{parentName:"tr",align:null},'Component to be rendered as content above a table on a "list view"')))),(0,o.kt)("p",null,"Usage example for ",(0,o.kt)("inlineCode",{parentName:"p"},"'PanelLocation.RESOURCE_LIST'"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addPanel(\n  PanelLocation.RESOURCE_LIST,\n  { resource: ['catalog.cattle.io.app'] },\n  { component: () => import('./BannerComponent.vue') }\n);\n")))}c.isMDXComponent=!0},8886:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/detailtop-93d0c11527f85f73edb5a839132b9b90.png"},3365:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/list-view-8eecca10089243a82abac917e3e8dbb5.png"},5958:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/masthead-f9ad33e650fbc0029145d6e4c664cb23.png"}}]);