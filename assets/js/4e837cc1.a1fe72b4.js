"use strict";(self.webpackChunkrancher_ui_devkit=self.webpackChunkrancher_ui_devkit||[]).push([[3619],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>d});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),l=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},m=function(e){var t=l(e.components);return o.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},c=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=l(n),d=r,f=c["".concat(s,".").concat(d)]||c[d]||u[d]||i;return n?o.createElement(f,a(a({ref:t},m),{},{components:n})):o.createElement(f,a({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=c;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p.mdxType="string"==typeof e?e:r,a[1]=p;for(var l=2;l<i;l++)a[l]=n[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}c.displayName="MDXCreateElement"},3151:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>l});var o=n(7462),r=(n(7294),n(3905));const i={},a="Auto-Import Folders",p={unversionedId:"extensions/api/components/auto-import",id:"extensions/api/components/auto-import",title:"Auto-Import Folders",description:"Rancher simplifies the registration of components through auto-import folders.",source:"@site/docs/extensions/api/components/auto-import.md",sourceDirName:"extensions/api/components",slug:"/extensions/api/components/auto-import",permalink:"/dashboard/extensions/api/components/auto-import",draft:!1,tags:[],version:"current",lastUpdatedAt:1684487988,formattedLastUpdatedAt:"May 19, 2023",frontMatter:{},sidebar:"mainSidebar",previous:{title:"Custom Node Driver UI",permalink:"/dashboard/extensions/api/components/node-drivers"},next:{title:"Common Types",permalink:"/dashboard/extensions/api/common"}},s={},l=[],m={toc:l};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"auto-import-folders"},"Auto-Import Folders"),(0,r.kt)("p",null,"Rancher simplifies the registration of components through auto-import folders."),(0,r.kt)("p",null,"This must feature must be enabled in an extension, by calling the ",(0,r.kt)("inlineCode",{parentName:"p"},"importTypes")," function in the extension's initialization function, for example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { importTypes } from '@rancher/auto-import';\n\n// Initialize the extension\nexport default function(plugin: IPlugin) {\n  // Auto-import model, detail, edit from the folders\n  importTypes(plugin);\n\n  // ...\n}\n")),(0,r.kt)("p",null,"With this enabled, the extension build tooling will auto-generate component registration for you, based on folder names, without you having\nto do this manually."),(0,r.kt)("p",null,"The folder names match the ",(0,r.kt)("inlineCode",{parentName:"p"},"type")," property of the ",(0,r.kt)("inlineCode",{parentName:"p"},"register")," function. For example, to automatically register a ",(0,r.kt)("inlineCode",{parentName:"p"},"list")," component, create a folder named ",(0,r.kt)("inlineCode",{parentName:"p"},"list"),"\nin your extension and ensure the code above is added."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"ID")," of the component is taken from the filename, so to automatically get the equivalent of:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import NamespaceList from './NamespaceList.vue`;\n\n// Initialize the extension\nexport default function(plugin: IPlugin) {\n\n  plugin.register('list', 'namespace', NamespaceList);\n\n  // ...\n}\n")),(0,r.kt)("p",null,"you would instead create the component ",(0,r.kt)("inlineCode",{parentName:"p"},"namespace.vue")," in the ",(0,r.kt)("inlineCode",{parentName:"p"},"list")," folder. Here the filename ",(0,r.kt)("inlineCode",{parentName:"p"},"namespace.vue")," matches the id ",(0,r.kt)("inlineCode",{parentName:"p"},"namespace")," (the ",(0,r.kt)("inlineCode",{parentName:"p"},".vue")," extension is ignored)."))}u.isMDXComponent=!0}}]);