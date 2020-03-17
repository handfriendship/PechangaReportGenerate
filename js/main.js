$(document).ready(function(){

  $('#testbtn').click(function(){
    dummyImprGenerate('11-PEC-MP&001_GALA&Feb 01, 2020 to Feb 02, 2020&');
    linearPeriodGenerator([]);
    periodGenerator([['2020-01-01', '2020-01-05'], ['2020-01-21', '2020-01-26'], ['2020-01-27', '2020-01-31']]);

    var date = new Date(2020, 02, 28);

  })

  var clickCount = 0;
  $('.datepicker-menu .checkbox').click(function(){
    console.log("click");
    if(!$('#testDatepicker').val()){
      alert("Please select the date");
      return ;
    }
    // clickCount++;
    // console.log("value : ", $('#testDatepicker').val());
    // var valueElement = `<li class="dateElement">
    //     <a class="checkbox-a gn-icon gn-icon-illustrator">${$('#testDatepicker').val()}</a>
    //     <div class="checkbox-wrapper">
    //       <div class="checkbox-inner-wrap">
    //         <input class="delete-btn btn btn-outline-danger" type="button" name="check" value="Delete" />
    //       </div>
    //     </div>
    //   </li>`;
    // $('#datepicker-submenu').append(valueElement);
    // $('.delete-btn').on('click', {param1: $(this), param2: valueElement}, deleteDate);


    var campaignArr = Array.from($('.gn-menu').children('.campaign-menu'));
    console.log("campaignArr : ", campaignArr);
    console.log("typeof : ", typeof(campaignArr));
    campaignArr.forEach(element => {
      console.log("element : ", element);
      if($(element).find('input.checkbox').is(':checked')){
        var valueElement = `<li class="dateElement">
            <a class="checkbox-a gn-icon gn-icon-illustrator">${$('#testDatepicker').val()}</a>
            <div class="checkbox-wrapper">
              <div class="checkbox-inner-wrap">
                <input class="delete-btn btn btn-outline-danger" type="button" name="check" value="Delete" />
              </div>
            </div>
          </li>`;

        $(element).find('.gn-submenu').append(valueElement);
        $('.delete-btn').on('click', {param1: $(this), param2: valueElement}, deleteDate);
      }
    })
  })

  function deleteDate(event) {
    console.log("deleteDate called!");
    console.log("param1 : ", event.data.param1);

    var valueElement = $(event.data.param2);
    var dateElement = $(this).parent('.checkbox-inner-wrap').parent('.checkbox-wrapper').parent('.dateElement');

  }

  $("#testDatepicker").datepicker({
  });

  function generateCampaigns(_campaigns){
    console.log("_campaigns : ", _campaigns);
    _campaigns.forEach(element => {
      var campElement = $(`<li class="campaign-menu ${element}">
        <a class="checkbox-a gn-icon gn-icon-archive">${element}</a>
        <div class="checkbox-wrapper">
          <div class="checkbox-inner-wrap">
            <input class="checkbox" type="checkbox" name="check" />
          </div>
        </div>
        <ul class="gn-submenu">

        </ul>
      </li>`);
      console.log("campElement : ", campElement);
      $('.gn-menu').append(campElement);
    })

  }


  var categories = new Array();

  function getCategories(documentObj){
    if(documentObj[0] == null || documentObj[0] == undefined){
      alert("Please select the document that has any data");
    } else {
      for(let key in documentObj[0]){
        categories.push(key);
      }
    }
  }


  var rowObj = new Array();

  var totalImpr = 0;
  // var resultTable = $(`<table class="result-table">
  //   <thead>
  //     <tr class="result-table-thead-tr">
  //       <th>Campaign</th>
  //       <th>Location</th>
  //       <th>Week</th>
  //       <th>Impressions</th>
  //     </tr>
  //   </thead>
  //   <tbody class="result-tbody">
  //
  //   </tbody>
  // </table>`);


  const monDict = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
  const decodemonDict = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
  $('#excelFile').change(() => {
    console.log("excelFile change call!");
    $('.result-table-inner-wrap').html('');
    var input = event.target;
    var reader = new FileReader();
    reader.onload = () => {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type : 'binary'});
        wb.SheetNames.forEach((sheetName) => {
	        rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
	        // console.log(JSON.stringify(rowObj));
        })

        var campaigns = new Array();
        var object_per_campaign = new Array();
        var locations = new Array();
        var weeks = new Array();
        var impressions = new Array();
        var impressionObj = {};
        var locationWithoutDupl = new Array();
        var weekWithoutDupl = new Array();



        campaigns = Array.from(new Set(rowObj.map(obj => {
          return obj.Campaign;
        })))

        var temp1 = campaigns.map(campaign => {
          var sameCampaign = rowObj.filter(obj => {
            return obj.Campaign == campaign;
          })
          return Array.from(new Set(sameCampaign.map(campaign => {
            return campaign.Location;
          })));
        })
        locationWithoutDupl = Array.from(new Set(rowObj.map(obj => {
          return obj.Location;
        })))


        var weeks = campaigns.map(campaign => {
          var sameCampaign = rowObj.filter(obj => {
            return obj.Campaign == campaign;
          })
          return sortDate(Array.from(new Set(sameCampaign.map(campaign => {
            return campaign.Week;
          }))));
        })
        var linearWeeks = weeks.map(week => {
          return linearPeriodGenerator(week);
        })
        weekWithoutDupl = Array.from(new Set(rowObj.map(obj => {
          return obj.Week;
        })))

        var impressions = rowObj.map(obj => {
          // return {`${obj.Campaign}&${obj.Location}&${obj.Week}`: obj.Impressions};
          var returnObj = {};
          var key = `${obj.Campaign}&${obj.Location}&${obj.Week}&`;
          returnObj[key] = obj.Impressions;

          return returnObj;
        })

        rowObj.forEach(obj => {
          var key = `${obj.Campaign}\&${obj.Location}\&${obj.Week}\&`;
          impressionObj[key] = obj.Impressions;
        })

        for(let k = 0; k < campaigns.length; k++){
          object_per_campaign.push({_campaign: campaigns[k], _location: temp1[k], _week: linearWeeks[k]});
        }

        getCategories(rowObj);
        generateCampaigns(campaigns);

        console.log("campaigns : ", campaigns);
        console.log("object_per_campaign : ", object_per_campaign);
        console.log("locations : ", locations);
        console.log("weeks : ", weeks);
        console.log("impressions : ", impressions);
        console.log("impressionObj : ", impressionObj);

        var trCount = 0;
        var tableCount = 0;
        object_per_campaign.forEach(obj => {
          console.log("obj : ", obj);
          obj._location.forEach(location => {
            obj._week.forEach(sortedWeek => {
              if(trCount % 46 == 28 || trCount == 0){
                console.log("trCount, tableCount : ", trCount, ' and ', tableCount)
                var resultTable = $(`<table class="result-table">
                  <thead>
                    <tr class="result-table-thead-tr">
                      <th>Campaign</th>
                      <th>Location</th>
                      <th>Week</th>
                      <th>Impressions</th>
                    </tr>
                  </thead>
                  <tbody class="result-tbody">

                  </tbody>
                </table>
                `);

                tableCount++;
                $(`.result-table-inner-wrap`).append(resultTable.addClass(`result-table-${tableCount}`));
                $('.result-table-inner-wrap').append($(`<div class="pagination-div pagination-div-${tableCount}"></div>`));

              }
              if(trCount % 2 == 0){
                var tempTag = $('<tr class="tbody-tr-white"></tr>');
              } else {
                var tempTag = $('<tr class="tbody-tr-grey"></tr>');
              }
              var key = `${obj._campaign}&${location}&${sortedWeek}\&`;
              var valueBeforeChange = dummyImprGenerate(key, impressionObj);
              totalImpr = totalImpr + impressionObj[key];

              tempTag.append($(`<td>${obj._campaign}</td>
                <td>${location}</td>
                <td>${sortedWeek}</td><td>${impressionObj[key]}</td>`));
              tempTag.addClass(key);
              $(`.result-table-${tableCount} .result-tbody`).append(tempTag);
              trCount++;
            })
          })
        })
        var totalPage = $('.result-table-inner-wrap .result-table').length;
        for(let i = 0; i < totalPage; i++){
          $(`.pagination-div`).eq(i).text(`${i+1} of ${totalPage}`);
        }

        calcImpr(totalImpr, locationWithoutDupl, weekWithoutDupl)


    };
    reader.readAsBinaryString(input.files[0]);


  })

  function calcImpr(paramImpr, _locationWithoutDupl, _weekWithoutDupl) {
    var beginDate = readableDate(_weekWithoutDupl[0])[0];
    var endDate = readableDate(_weekWithoutDupl[_weekWithoutDupl.length - 1])[1];

    var tempBegin = beginDate.split('-');
    var tempEnd = endDate.split('-');

    var totalPeriod = dateDiff(beginDate, endDate);
    var totalLocations = _locationWithoutDupl.length;

    $('.total-impressions').text(paramImpr);
    $('.total-locations').text(totalLocations);
    $('.daily-impr').text(Math.floor(paramImpr / totalLocations / totalPeriod));
    $('.begin-date-span').text(`${decodemonDict[parseInt(tempBegin[0])]} ${tempBegin[1]}, ${tempBegin[2]}`);
    $('.end-date-span').text(`${decodemonDict[parseInt(tempEnd[0])]} ${tempEnd[1]}, ${tempEnd[2]}`);

    $('.weeks-in-period span').text(_weekWithoutDupl.length);

  }

  function dummyImprGenerate(key, _impressionObj) {
    const MIN_IMPR = 171;
    const MAX_IMPR = 200;

    var dateFormat = key.split('&')[categories.indexOf('Week')];
    var decodingDate = dateFormat.split(' to ');
    var startDate = decodingDate[0].split(' ');
    var endDate = decodingDate[1].split(' ');

    var dateGap = dateDiff(`${monDict[startDate[0]]}-${startDate[1].replace(/,/g,"")}-${startDate[2]}`,
          `${monDict[endDate[0]]}-${endDate[1].replace(/,/g,"")}-${endDate[2]}`) + 1;

    if(_impressionObj[key] == undefined || _impressionObj[key] == null){

      //171 ~ 200 per day
      // 나중에 평균과 중간값을 고려한 정교한 알고리즘 만들기
      _impressionObj[key] = getRandomInt(MIN_IMPR * dateGap, MAX_IMPR * dateGap);
      return 0;
    } else if((_impressionObj[key] < MIN_IMPR * (dateGap - 3) || _impressionObj[key] < 100)){
      var tempBeforeChange = _impressionObj[key]
      _impressionObj[key] = getRandomInt(MIN_IMPR * dateGap, MAX_IMPR * dateGap);

      return tempBeforeChange;
    } else {
      return 0;
    }
  }

  function dateDiff(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 :new Date(_date2);

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sortDate(dateArr) {

    dateArr.sort(function(a, b){
      var tempA = a.split(' ');
      var tempB = b.split(' ');

      tempA.splice(tempA.indexOf('to'));
      tempB.splice(tempB.indexOf('to'));

      return parseInt(`${tempA[2]}${monDict[tempA[0]]}${tempA[1]}`) - parseInt(`${tempB[2]}${monDict[tempB[0]]}${tempB[1]}`);
    })
    return dateArr;
  }

  function readableDate(dateFormat){

    var decodingDate = dateFormat.split(' to ');
    var startDate = decodingDate[0].split(' ');
    var endDate = decodingDate[1].split(' ');

    return new Array(`${monDict[startDate[0]]}-${startDate[1].replace(/,/g,"")}-${startDate[2]}`,
                `${monDict[endDate[0]]}-${endDate[1].replace(/,/g,"")}-${endDate[2]}`);
  }

  function unreadableDate(dateArr){
    var startDate = new Date(dateArr[0]);
    var endDate = new Date(dateArr[1]);
    var _startYear = startDate.getFullYear();
    var _startMonth = startDate.getMonth() + 1;
    var _startDate = startDate.getDate();
    var _endYear = endDate.getFullYear();
    var _endMonth = endDate.getMonth() + 1;
    var _endDate = endDate.getDate();
    if(_startDate < 10){
      _startDate = `0${_startDate}`;
    }
    if(_endDate < 10){
      _endDate = `0${_endDate}`;
    }

    return `${decodemonDict[_startMonth]} ${_startDate}, ${_startYear} to ${decodemonDict[_endMonth]} ${_endDate}, ${_endYear}`;
  }

  function linearPeriodGenerator(weekArr) {

    // 1. 각각이 다 연결되어 있는지 체크한다
    // 2. 연결되어있지 않다면 중간에
    var readableWeekArr = weekArr.map(element => {
      return readableDate(element);
    })

    if(!linearCheck(readableWeekArr)){
      var tempArr =  periodGenerator(readableWeekArr);
      var resultArr = tempArr.map(temp => {
        return unreadableDate(temp);
      })
      return resultArr;
    } else {
      return weekArr;
    }

  }

  function linearCheck(testArr){
    return testArr.reduce((cumulated, currentValue, currentIndex, array) => {
      var value = (dateDiff(currentValue[0], array[currentIndex-1][1]) == 1);
      if(currentIndex == 1){
        cumulated = true;
      }

      return (value && cumulated);
    })
  }


  function periodGenerator(weekArr){
    var startDate = weekArr[0][0];
    var endDate = weekArr[weekArr.length-1][1];

    return recursiveGen(startDate, endDate);
  }

  function recursiveGen(startDate, endDate, arr = new Array()){
    var newDate = new Date(startDate);
    // console.log("newDate : ", newDate);
    newDate.setDate(newDate.getDate() + 7 - newDate.getDay());

    var newDateForm = getDateForm(newDate);
    var endDateCheck = new Date(newDate);
    var nextStartDate = new Date(newDate);
    endDateCheck.setDate(endDateCheck.getDate() - (7 - new Date(endDate).getDay()));
    nextStartDate.setDate(nextStartDate.getDate() + 1);

    var endDateCheckForm = getDateForm(endDateCheck);
    var nextStartDateForm = getDateForm(nextStartDate);

    if(endDate == endDateCheckForm){
      arr.push(new Array(startDate, endDateCheckForm));
      return arr;
    }

    arr.push(new Array(startDate, newDateForm));
    return recursiveGen(nextStartDateForm, endDate, arr);
  }

  function getDateForm(dateObj){
    // console.log("dateObj : ", dateObj);
    var _newMonth = dateObj.getMonth() + 1;
    if(_newMonth < 10){
      _newMonth = `0${_newMonth}`;
    }
    var _newDate = dateObj.getDate();
    if(_newDate < 10){
      _newDate = `0${_newDate}`;
    }
    var _newYear = dateObj.getFullYear();

    return `${_newMonth}-${_newDate}-${_newYear}`;
  }




  // console.log("recursiveGen : ", recursiveGen(tempDate3, tempDate4));
  // console.log("recursiveGen : ", recursiveGen(tempDate5, tempDate6));

  // function recursiveGen(startDate, endDate){
  //   var newDate = new Date(startDate).setDate(startDate.getDate() + 6 - startDate.getDay());;
  //   arr.push(new Array([startDate, newDate]));
  // }




})
