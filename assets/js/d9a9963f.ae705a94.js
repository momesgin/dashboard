"use strict";(self.webpackChunkrancher_ui_devkit=self.webpackChunkrancher_ui_devkit||[]).push([[3809],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>c});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=d(n),c=r,b=u["".concat(p,".").concat(c)]||u[c]||m[c]||l;return n?a.createElement(b,o(o({ref:t},s),{},{components:n})):a.createElement(b,o({ref:t},s))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=u;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var d=2;d<l;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5058:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>m,frontMatter:()=>l,metadata:()=>i,toc:()=>d});var a=n(7462),r=(n(7294),n(3905));const l={},o="addTab",i={unversionedId:"extensions/extension-api-methods/add-tab",id:"extensions/extension-api-methods/add-tab",title:"addTab",description:"(Rancher version v2.7.2)",source:"@site/docs/extensions/extension-api-methods/add-tab.md",sourceDirName:"extensions/extension-api-methods",slug:"/extensions/extension-api-methods/add-tab",permalink:"/dashboard/extensions/extension-api-methods/add-tab",draft:!1,tags:[],version:"current",lastUpdatedAt:1681224417,formattedLastUpdatedAt:"Apr 11, 2023",frontMatter:{},sidebar:"mainSidebar",previous:{title:"addPanel",permalink:"/dashboard/extensions/extension-api-methods/add-panel"},next:{title:"addTableColumn",permalink:"/dashboard/extensions/extension-api-methods/add-table-column"}},p={},d=[{value:"<code>&#39;TabLocation.RESOURCE_DETAIL&#39;</code> options",id:"tablocationresource_detail-options",level:2}],s={toc:d};function m(e){let{components:t,...l}=e;return(0,r.kt)("wrapper",(0,a.Z)({},s,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"addtab"},"addTab"),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"(Rancher version v2.7.2)")),(0,r.kt)("p",null,"This method adds a tab to the UI."),(0,r.kt)("p",null,"Method:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addTab(where: String, when: LocationConfig, options: Object);\n")),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Arguments")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"where")," string parameter admissable values for this method:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Key"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"TabLocation.RESOURCE_DETAIL")),(0,r.kt)("td",{parentName:"tr",align:null},"String"),(0,r.kt)("td",{parentName:"tr",align:null},"Location for a Tab on a Resource Detail page")))),(0,r.kt)("br",null),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"when")," Object admissable values:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"LocationConfig")," as described above for the ",(0,r.kt)("a",{parentName:"p",href:"../extensions-api#locationconfig-object-definition-when"},"LocationConfig object"),"."),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("h2",{id:"tablocationresource_detail-options"},(0,r.kt)("inlineCode",{parentName:"h2"},"'TabLocation.RESOURCE_DETAIL'")," options"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Tabs",src:n(4507).Z,width:"1511",height:"1001"})),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"options")," config object. Admissable parameters for the ",(0,r.kt)("inlineCode",{parentName:"p"},"options")," with ",(0,r.kt)("inlineCode",{parentName:"p"},"'TabLocation.RESOURCE_DETAIL'")," are:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Key"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"name")),(0,r.kt)("td",{parentName:"tr",align:null},"String"),(0,r.kt)("td",{parentName:"tr",align:null},"Query param name used in url when tab is active/clicked")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"label")),(0,r.kt)("td",{parentName:"tr",align:null},"String"),(0,r.kt)("td",{parentName:"tr",align:null},"Text for the tab label")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"labelKey")),(0,r.kt)("td",{parentName:"tr",align:null},"String"),(0,r.kt)("td",{parentName:"tr",align:null},'Same as "label" but allows for translation. Will superseed "label"')),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"weight")),(0,r.kt)("td",{parentName:"tr",align:null},"Int"),(0,r.kt)("td",{parentName:"tr",align:null},"Defines the order on which the tab is displayed in relation to other tabs in the component")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"showHeader")),(0,r.kt)("td",{parentName:"tr",align:null},"Boolean"),(0,r.kt)("td",{parentName:"tr",align:null},"Whether the tab header is displayed or not")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"tooltip")),(0,r.kt)("td",{parentName:"tr",align:null},"String"),(0,r.kt)("td",{parentName:"tr",align:null},"Tooltip message (on tab header)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"component")),(0,r.kt)("td",{parentName:"tr",align:null},"Function"),(0,r.kt)("td",{parentName:"tr",align:null},"Component to be rendered as content on the tab")))),(0,r.kt)("p",null,"Usage example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"plugin.addTab( \n  TabLocation.RESOURCE_DETAIL,\n  { resource: ['pod'] }, \n  {\n    name:       'some-name',\n    labelKey:   'plugin-examples.tab-label',\n    label:      'some-label',\n    weight:     -5,\n    showHeader: true,\n    tooltip:    'this is a tooltip message',\n    component:  () => import('./MyTabComponent.vue')\n  }\n);\n")))}m.isMDXComponent=!0},4507:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/add-tab-27c2ec2f62a38c1559d6841c14b4f266.png"}}]);