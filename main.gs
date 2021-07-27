// Slackからの入力を受け取る
function doPost(e) {
  const data = e.parameter;
  recordData(data);
}

// Slackへ作業開始or終了を通知
function postSlack(text) {
  // Incoming WebHookのURLを設定
  var url = "";
  var options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    payload: '{"text":"' + text + '"}',
  };
  UrlFetchApp.fetch(url, options);
}

function recordData(data) {
  const name = data.user_name;
  const text = data.text;
  // const name ="test"
  // const text="開始"

  let recordsheet = SpreadsheetApp.getActive().getSheetByName(name);
  // 同じ名前のシートがなければ作成
  if (!recordsheet) {
    recordsheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    recordsheet.setName(name);
    recordsheet.getRange("A1:J1000").setHorizontalAlignment("center");
    recordsheet
      .getRange("A1")
      .setValue("日付")
      .setBackground("#cfe2f3");
    recordsheet
      .getRange("B1")
      .setValue("開始時刻")
      .setBackground("#cfe2f3");
    recordsheet
      .getRange("C1")
      .setValue("終了時刻")
      .setBackground("#cfe2f3");
    recordsheet
      .getRange("D1")
      .setValue("作業時間")
      .setBackground("#cfe2f3");
    recordsheet
      .getRange("E1")
      .setValue("メモ")
      .setBackground("#cfe2f3");
    recordsheet.setColumnWidth(5, 300);
  }

  var date = new Date();
  const dateStr = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd");
  const fullDateStr = Utilities.formatDate(
    date,
    "Asia/Tokyo",
    "yyyy/MM/dd HH:mm"
  );

  // 開始時刻の列数
  var lastStartRow = recordsheet
    .getRange(1, 2, recordsheet.getLastRow(), 1)
    .getValues()
    .filter(String).length;
  //終了時刻の列数
  var lastFinishRow = recordsheet
    .getRange(1, 3, recordsheet.getLastRow(), 1)
    .getValues()
    .filter(String).length;

  if (text.indexOf("開始") > -1) {
    if (lastStartRow !== lastFinishRow) {
      // もしも前回の作業終了時刻が記録されていなかったときは、前回の作業を終了させて上書き
      const lastStartDate = recordsheet.getRange(lastStartRow, 2).getValue();
      recordsheet
        .getRange(lastStartRow, 3)
        .setValue(lastStartDate)
        .setNumberFormat("H:mm");
      return postSlack(
        "前回の作業が終了されていなかったため、作業の中断を記録しました。\n" +
          fullDateStr
      );
    }
    recordsheet.getRange(lastStartRow + 1, 1).setValue(dateStr);
    recordsheet
      .getRange(lastStartRow + 1, 2)
      .setValue(date)
      .setNumberFormat("H:mm");

    // メモがあった場合記入
    if (text.indexOf("メモ") > -1) {
      const memo = text.slice(text.indexOf("メモ") + 3);
      recordsheet.getRange(lastStartRow + 1, 5).setValue(memo);
    }
    return postSlack("作業を開始しました！\n" + fullDateStr);
  }

  if (text.indexOf("終了") > -1) {
    if (lastStartRow === lastFinishRow) {
      // もし作業開始時刻が入力されていなかった場合
      return postSlack("作業開始時刻が記録されていません。");
    }
    recordsheet
      .getRange(lastFinishRow + 1, 3)
      .setValue(date)
      .setNumberFormat("H:mm");
    recordsheet
      .getRange(lastFinishRow + 1, 4)
      .setFormulaR1C1("=RC[-1]-RC[-2]")
      .setNumberFormat("[h]:mm:ss");

    // メモがあった場合記入
    if (text.indexOf("メモ") > -1) {
      const memo = text.slice(text.indexOf("メモ") + 3);
      recordsheet.getRange(lastFinishRow + 1, 5).setValue(memo);
    }

    return postSlack("作業を終了しました！\n" + fullDateStr);
  }
}
