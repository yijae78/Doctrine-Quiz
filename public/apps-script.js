// ============================================================
// 교회 교육 앱 - Google Apps Script 백엔드
// 이 코드를 Google Sheet의 Apps Script 에디터에 붙여넣으세요.
// ============================================================

const SHEET_HEADERS = {
  config: ['key', 'value'],
  students: ['id', 'name', 'talents', 'classId', 'completedMissions', 'ownedStickers', 'completedChallenges', 'firstLoginDone', 'blocked'],
  classes: ['id', 'name'],
  shop_items: ['id', 'name', 'icon', 'price'],
  challenges: ['id', 'title', 'description', 'talents', 'type'],
  pending_missions: ['id', 'studentId', 'studentName', 'topicId', 'topicTitle', 'missionId', 'missionText', 'createdAt'],
  sessions: ['id', 'name', 'loggedInAt'],
  teachers: ['id', 'name', 'kakaoLink'],
};

// ===== 시트 접근 헬퍼 =====

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = SHEET_HEADERS[name];
    if (headers) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== 범용 CRUD =====

function readAll(sheetName) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var results = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (typeof val === 'string' && val.length > 0 && (val.charAt(0) === '[' || val.charAt(0) === '{')) {
        try { val = JSON.parse(val); } catch (e) {}
      }
      obj[headers[j]] = val;
    }
    results.push(obj);
  }
  return results;
}

function findRowIndex(sheetName, colIndex, value) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) return i + 1; // 1-based row
  }
  return -1;
}

function findRowById(sheetName, id) {
  return findRowIndex(sheetName, 0, id);
}

function findRowByName(sheetName, name) {
  return findRowIndex(sheetName, 1, name);
}

function upsertRow(sheetName, data) {
  var sheet = getSheet(sheetName);
  var headers = SHEET_HEADERS[sheetName];
  var values = [];
  for (var j = 0; j < headers.length; j++) {
    var val = data[headers[j]];
    if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
      val = JSON.stringify(val);
    }
    values.push(val !== undefined && val !== null ? val : '');
  }
  var existingRow = findRowById(sheetName, data.id);
  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
  return { ok: true, id: data.id };
}

function deleteRowById(sheetName, id) {
  var row = findRowById(sheetName, id);
  if (row > 0) {
    getSheet(sheetName).deleteRow(row);
    return { ok: true };
  }
  return { ok: false, error: 'Not found' };
}

// ===== Config (key-value) =====

function readConfig() {
  var sheet = getSheet('config');
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    var key = data[i][0];
    var val = data[i][1];
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val !== '' && !isNaN(Number(val))) val = Number(val);
    config[key] = val;
  }
  return config;
}

function handleUpdateConfig(configObj) {
  var sheet = getSheet('config');
  var data = sheet.getDataRange().getValues();
  var keyRows = {};
  for (var i = 1; i < data.length; i++) {
    keyRows[data[i][0]] = i + 1;
  }
  var keys = Object.keys(configObj);
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var val = configObj[key];
    if (typeof val === 'object') val = JSON.stringify(val);
    if (keyRows[key]) {
      sheet.getRange(keyRows[key], 2).setValue(String(val));
    } else {
      sheet.appendRow([key, String(val)]);
    }
  }
  return { ok: true };
}

// ===== 학생 헬퍼 =====

function getStudentByRow(sheetName, rowNum) {
  var sheet = getSheet(sheetName);
  var headers = SHEET_HEADERS[sheetName];
  var row = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
  var obj = {};
  for (var j = 0; j < headers.length; j++) {
    var val = row[j];
    if (typeof val === 'string' && val.length > 0 && (val.charAt(0) === '[' || val.charAt(0) === '{')) {
      try { val = JSON.parse(val); } catch (e) {}
    }
    obj[headers[j]] = val;
  }
  return obj;
}

function updateStudentField(studentId, field, value) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var headers = SHEET_HEADERS['students'];
  var colIndex = -1;
  for (var j = 0; j < headers.length; j++) {
    if (headers[j] === field) { colIndex = j; break; }
  }
  if (colIndex < 0) return { ok: false, error: 'Invalid field' };
  var writeVal = (Array.isArray(value) || (typeof value === 'object' && value !== null)) ? JSON.stringify(value) : value;
  getSheet('students').getRange(row, colIndex + 1).setValue(writeVal);
  return { ok: true };
}

// ===== 비즈니스 로직 =====

function handleLogin(name) {
  var config = readConfig();
  var sheet = getSheet('students');
  var row = findRowByName('students', name);

  var student;
  var firstLoginBonus = 0;

  if (row > 0) {
    student = getStudentByRow('students', row);
    if (student.blocked === true || student.blocked === 'true') {
      return { blocked: true };
    }
  } else {
    // 새 학생 생성
    var id = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    var initTalents = config.initialCurrency || 100;
    var bonus = config.firstLoginBonus || 50;
    student = {
      id: id,
      name: name,
      talents: initTalents + bonus,
      classId: '',
      completedMissions: [],
      ownedStickers: [],
      completedChallenges: [],
      firstLoginDone: true,
      blocked: false,
    };
    upsertRow('students', student);
    firstLoginBonus = bonus;
  }

  // 세션 기록
  var sessionId = 'sess_' + Date.now();
  upsertRow('sessions', { id: sessionId, name: name, loggedInAt: new Date().toISOString() });

  // 첫 로그인 보너스 처리 (기존 학생이 아직 안 받은 경우)
  if (!student.firstLoginDone && row > 0) {
    var bonus2 = config.firstLoginBonus || 50;
    student.talents = (Number(student.talents) || 0) + bonus2;
    student.firstLoginDone = true;
    updateStudentField(student.id, 'talents', student.talents);
    updateStudentField(student.id, 'firstLoginDone', true);
    firstLoginBonus = bonus2;
  }

  return {
    id: student.id,
    name: student.name,
    talents: Number(student.talents) || 0,
    classId: student.classId || '',
    completedMissions: student.completedMissions || [],
    ownedStickers: student.ownedStickers || [],
    completedChallenges: student.completedChallenges || [],
    firstLoginBonus: firstLoginBonus,
    blocked: false,
  };
}

function handleAddTalents(studentId, amount) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var student = getStudentByRow('students', row);
  var newTalents = (Number(student.talents) || 0) + Number(amount);
  if (newTalents < 0) newTalents = 0;
  getSheet('students').getRange(row, 3).setValue(newTalents); // talents = col 3
  return { ok: true, talents: newTalents };
}

function handleCompleteMission(studentId, missionId) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var student = getStudentByRow('students', row);
  var missions = student.completedMissions || [];
  if (!Array.isArray(missions)) missions = [];
  if (missions.indexOf(missionId) === -1) {
    missions.push(missionId);
    updateStudentField(studentId, 'completedMissions', missions);
  }
  return { ok: true, completedMissions: missions };
}

function handleUncompleteMission(studentId, missionId) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var student = getStudentByRow('students', row);
  var missions = student.completedMissions || [];
  if (!Array.isArray(missions)) missions = [];
  var idx = missions.indexOf(missionId);
  if (idx >= 0) {
    missions.splice(idx, 1);
    updateStudentField(studentId, 'completedMissions', missions);
  }
  return { ok: true, completedMissions: missions };
}

function handleBuySticker(studentId, stickerId, price) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var student = getStudentByRow('students', row);
  var talents = Number(student.talents) || 0;
  var stickers = student.ownedStickers || [];
  if (!Array.isArray(stickers)) stickers = [];

  if (talents < Number(price)) return { ok: false, error: 'Not enough talents' };
  if (stickers.indexOf(stickerId) >= 0) return { ok: false, error: 'Already owned' };

  stickers.push(stickerId);
  talents -= Number(price);
  var sheet = getSheet('students');
  sheet.getRange(row, 3).setValue(talents); // talents col
  updateStudentField(studentId, 'ownedStickers', stickers);

  return { ok: true, talents: talents, ownedStickers: stickers };
}

function handleCompleteChallenge(studentId, challengeId) {
  var row = findRowById('students', studentId);
  if (row < 0) return { ok: false, error: 'Student not found' };
  var student = getStudentByRow('students', row);
  var challenges = student.completedChallenges || [];
  if (!Array.isArray(challenges)) challenges = [];
  if (challenges.indexOf(challengeId) === -1) {
    challenges.push(challengeId);
    updateStudentField(studentId, 'completedChallenges', challenges);
  }
  return { ok: true, completedChallenges: challenges };
}

function handleSubmitMission(data) {
  if (!data.id) data.id = 'pm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  upsertRow('pending_missions', data);
  return { ok: true, id: data.id };
}

function handleApproveMission(missionId, talentReward) {
  // 미션 찾기
  var missions = readAll('pending_missions');
  var target = null;
  for (var i = 0; i < missions.length; i++) {
    if (missions[i].id === missionId) { target = missions[i]; break; }
  }
  if (!target) return { ok: false, error: 'Mission not found' };

  // 미션 삭제
  deleteRowById('pending_missions', missionId);

  // 달란트 지급
  if (talentReward && target.studentId) {
    handleAddTalents(target.studentId, Number(talentReward));
  }

  return { ok: true };
}

function handleRejectMission(missionId) {
  return deleteRowById('pending_missions', missionId);
}

function handleBlockStudent(studentId, block) {
  return updateStudentField(studentId, 'blocked', block);
}

function handleResetData() {
  var sheetNames = ['students', 'classes', 'shop_items', 'challenges', 'pending_missions', 'sessions', 'teachers'];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < sheetNames.length; i++) {
    var sheet = ss.getSheetByName(sheetNames[i]);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
  }
  return { ok: true };
}

// ===== Google Drive 파일 관리 =====

var APP_FOLDER_NAME = '교회교육앱_자료';
var CATEGORY_NAMES = {
  'teacher-manual': '교사용 지도안',
  'teacher-workbook': '학생용 활동지',
  'slides': '교육용 PPT',
  'corner-learning': '코너학습 가이드',
};

function getOrCreateFolder(parentFolder, name) {
  var folders = parentFolder.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parentFolder.createFolder(name);
}

function getAppFolder() {
  var root = DriveApp.getRootFolder();
  return getOrCreateFolder(root, APP_FOLDER_NAME);
}

function getCategoryFolder(categoryId) {
  var appFolder = getAppFolder();
  var name = CATEGORY_NAMES[categoryId] || categoryId;
  return getOrCreateFolder(appFolder, name);
}

function handleListFiles(categoryId) {
  var folder = getCategoryFolder(categoryId);
  var files = folder.getFiles();
  var result = [];
  while (files.hasNext()) {
    var file = files.next();
    result.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: String(file.getSize()),
      createdTime: file.getDateCreated().toISOString(),
      webViewLink: file.getUrl(),
      webContentLink: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
    });
  }
  return { ok: true, files: result };
}

function handleUploadFile(categoryId, fileName, base64Data, mimeType) {
  var folder = getCategoryFolder(categoryId);
  var decoded = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', fileName);
  var file = folder.createFile(blob);
  return {
    ok: true,
    file: {
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: String(file.getSize()),
      createdTime: file.getDateCreated().toISOString(),
      webViewLink: file.getUrl(),
      webContentLink: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
    }
  };
}

function handleDeleteFile(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ===== HTTP 핸들러 =====

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';

  switch (action) {
    case 'ping':
      return jsonResponse({ ok: true, version: '1.0' });

    case 'getConfig':
      return jsonResponse(readConfig());

    case 'getSharedData':
      return jsonResponse({
        config: readConfig(),
        students: readAll('students'),
        classes: readAll('classes'),
        shopItems: readAll('shop_items'),
        challenges: readAll('challenges'),
        pendingMissions: readAll('pending_missions'),
        sessions: readAll('sessions'),
        teachers: readAll('teachers'),
      });

    case 'getStudent':
      var name = e.parameter.name;
      if (!name) return jsonResponse({ error: 'name parameter required' });
      var sRow = findRowByName('students', name);
      if (sRow < 0) return jsonResponse({ error: 'Not found' });
      return jsonResponse(getStudentByRow('students', sRow));

    case 'getAllData':
      return jsonResponse({
        config: readConfig(),
        students: readAll('students'),
        classes: readAll('classes'),
        shopItems: readAll('shop_items'),
        challenges: readAll('challenges'),
        pendingMissions: readAll('pending_missions'),
        sessions: readAll('sessions'),
        teachers: readAll('teachers'),
      });

    case 'listFiles':
      var catId = e.parameter.categoryId;
      if (!catId) return jsonResponse({ error: 'categoryId required' });
      return jsonResponse(handleListFiles(catId));

    default:
      return jsonResponse({ error: 'Unknown action: ' + action });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return jsonResponse({ error: 'Server busy, please retry' });
  }

  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    switch (action) {
      case 'login':
        return jsonResponse(handleLogin(body.name));

      case 'addTalents':
        return jsonResponse(handleAddTalents(body.studentId, body.amount));

      case 'giveTalents':
        return jsonResponse(handleAddTalents(body.studentId, body.amount));

      case 'completeMission':
        return jsonResponse(handleCompleteMission(body.studentId, body.missionId));

      case 'uncompleteMission':
        return jsonResponse(handleUncompleteMission(body.studentId, body.missionId));

      case 'buySticker':
        return jsonResponse(handleBuySticker(body.studentId, body.stickerId, body.price));

      case 'completeChallenge':
        return jsonResponse(handleCompleteChallenge(body.studentId, body.challengeId));

      case 'submitMission':
        return jsonResponse(handleSubmitMission(body.data));

      case 'approveMission':
        return jsonResponse(handleApproveMission(body.missionId, body.talentReward));

      case 'rejectMission':
        return jsonResponse(handleRejectMission(body.missionId));

      case 'writeRecord':
        return jsonResponse(upsertRow(body.table, body.data));

      case 'deleteRecord':
        return jsonResponse(deleteRowById(body.table, body.id));

      case 'updateConfig':
        return jsonResponse(handleUpdateConfig(body.config));

      case 'blockStudent':
        return jsonResponse(handleBlockStudent(body.studentId, true));

      case 'unblockStudent':
        return jsonResponse(handleBlockStudent(body.studentId, false));

      case 'resetData':
        return jsonResponse(handleResetData());

      case 'uploadFile':
        return jsonResponse(handleUploadFile(body.categoryId, body.fileName, body.base64Data, body.mimeType));

      case 'deleteFile':
        return jsonResponse(handleDeleteFile(body.fileId));

      default:
        return jsonResponse({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.message || 'Internal error' });
  } finally {
    lock.releaseLock();
  }
}
