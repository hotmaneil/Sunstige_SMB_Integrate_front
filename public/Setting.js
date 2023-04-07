let EapSetting = {
  WebApiPath: 'http://localhost:44343/api',
  // WebApiPath: "http://60.248.202.173:8081/api",
  // WebApiPath: "http://10.1.1.40:8078/api",
  WebSocketPath: 'ws://localhost:9801/ws',
}

let SmbSetting = {
  WebApiPath: 'http://localhost:44343/api',
  // WebApiPath: "http://10.1.1.40:8078/api",
  // WebApiPath: "http://60.248.202.173:8081/api",
}

/** 選單功能下的設備種類開關 */
let CategoryOpenSetting={
  Roboshot:true,
  PLC:true,
  CNC:true
}

/** 站台網址 */
let WebApiUrl='http://localhost:44343'

/**
 *  是否開啟即時設備總覽(SignalR)頁面
 *  若否為非即時設備總覽(定時更新)頁面
 */
let OpenEquipmentOverViewSignalR=false

/** 是否開啟模具維護功能模組 */
let isOpenMold=true

/** 是否開啟物料維護模組 */
let isOpenMaterial=true

/** 是否開啟設備保養模組 */
let isOpenEquipmentMaintain=true

/** 是否開啟成型條件模組功能 */
let isOpenConditions=true

/** 是否開啟參數運行監視模組功能 */
let isOpenEAPstatistics=true

/** 是否開啟閒置時間之設定與分析功能 */
let isOpenIdleFunctions=true

/** 首頁是否顯示Logo */
let IsShowLogo=false

/** 設備總覽按下跳出對話框還是導向到設備狀況 */
let DialogOrRedirect='Redirect'

/** 設備總覽主題 */
let equipmentOverViewTheme='white'

/** 是否開啟設備運行現況之圓餅圖頁面*/
let isOpenEquipmentActionStatusPie=true

/** 是否開啟設備運行現況之長條圖頁面*/
let isOpenEquipmentActionStatusBar=true

/** 登入頁面設定 */
let loginPageName='indexParticles'

/** 登入頁面客戶名 */
let loginPageCustomerName='客戶名'

/** 是否開啟警示訊息紀錄 */
let isOpenAlertLog=true

/** 是否啟用匯入設備保養計畫之按鈕 */
window.sunstige_conf={
  API_DOMAIN: 'localhost:44343',
  IsEnableImportMaintainPlan:true
}
