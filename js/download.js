$(document).ready(function(){
  console.log("download.js loaded!");

  $('#excel-download').on('click', {param1 : 'result-table-wrapper', param2: 'Pechanga Monthly Report'}, fnExcelReport);
  $('#pdf-download').on('click', {param1 : '#displayExcelHtml', param2: 'Pechanga Monthly Report'}, fnPDFReport);

  var reportTemplate = '';

  function fnExcelReport(event) {
    var id = event.data.param1;
    var title = event.data.param2;

    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head> <style></style> <body>';
    tab_text = tab_text + "<h1>CA HEALTH REPORT</h1><table border='1px'>";
    var exportTable = $('.' + id).clone();
    // var downloadCSS = $('#dynamic_div').load('remote.html');

    var downloadCSS = '';
    $.ajax({
      url:'/download.html',
      context: document.body,
      async: false,
      success: function(response){
        tab_text = tab_text.replace('<style></style>', response);
        downloadCSS = response;
      }
    });

    // console.log("exportTable : ", exportTable);
    // console.log("exportTable.html() : ", exportTable.html());
    // console.log("exportTable.html() : ", $(exportTable).html());
    exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
    tab_text = tab_text + exportTable.html();
    tab_text = tab_text + '</table></body></html>';
    var data_type = 'data:application/vnd.ms-excel';
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var fileName = title + '.xls';
    //Explorer 환경에서 다운로드
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      if (window.navigator.msSaveBlob) {
        var blob = new Blob([tab_text], {
          type: "application/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, fileName);
      }
    } else {
      var blob2 = new Blob([tab_text], {
        type: "application/csv;charset=utf-8;"
      });
      var filename = fileName;
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob2);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
    console.log("tab_text : ", tab_text);
  }

  function fnPDFReport(event) {
    var id = event.data.param1;
    var title = event.data.param2;

    console.log("fnPDFReport called!");
    html2canvas(document.querySelector("#displayExcelHtml")).then(canvas => {

       console.log("html2canvas then called!");
       console.log("canvas : ", canvas);

       var imgData = canvas.toDataURL('image/png');

       var imgWidth = 210; // 이미지 가로 길이(mm) A4 기준
       var pageHeight = imgWidth * 1.414;  // 출력 페이지 세로 길이 계산 A4 기준
       var imgHeight = canvas.height * imgWidth / canvas.width;
       var heightLeft = imgHeight;

       var doc = new jsPDF('p', 'mm');
       var position = 0;

       // 첫 페이지 출력
       doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
       heightLeft -= pageHeight;

       // 한 페이지 이상일 경우 루프 돌면서 출력
       while (heightLeft >= 20) {
         position = heightLeft - imgHeight;
         doc.addPage();
         doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
         heightLeft -= pageHeight;
       }

       // 파일 저장
       doc.save(`${title}.pdf`);
    });
  }


})
