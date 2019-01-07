$ = jQuery;
$(document).ready(function () {
 
})

function PageInit(type)
{
    nlapiSetFieldValue('probability', '');
    var stageVal = nlapiGetFieldText('custbodyopportunity_stage');
    if (stageVal) {
        var tmpArr = stageVal.split("-");
        if( tmpArr && tmpArr.length > 1 ) {
          var probability = tmpArr[1].trim();
          nlapiSetFieldValue('probability', probability);     
          calculateWeightedMRR(probability);
          calculateWeightedNRR(probability);
          calculateWeightedGP(probability);
        }
    }
    calculateRPU();
}

function SaveRecord()
{
    var stageVal = nlapiGetFieldText('custbodyopportunity_stage');
    var reason = nlapiGetFieldText('winlossreason');
    var note = nlapiGetFieldValue('custbodyother_notes');
    if(stageVal == "Lost - 0%" || stageVal == "Dead - 0%")
    {
        if (reason) {
          if (reason == "Other*" && note * 1 == 0) {
              alert('Please fill out *OTHER NOTES field');
          } else {
              if (stageVal == "Lost - 0%") {
                  if (reason == "Availability" || reason == "Price" || reason == "Timeframe") {
                      return true;
                  } else {
                      alert('Please choose Availability, Price, Timeframe or Other');
                  }
              } else {
                  if (reason == "Changed Mind" || reason == "Out of Business") {
                      return true;
                  } else {
                      alert('Please choose Changed Mind, Out of Business or Other');
                  }
              }
              return true;  
          }
        } else {
            alert('Please select WIN/LOSS REASON Value');
        }
    }
    else
    {
        return true;
    }
}

function FieldChanged(type, name)
{
  if(name == 'custbodyopportunity_stage'){
        nlapiSetFieldValue('probability', '');
        var stageVal = nlapiGetFieldText('custbodyopportunity_stage');
        if (stageVal) {
            var tmpArr = stageVal.split("-");
            if( tmpArr && tmpArr.length > 1 ) {
                var probability = tmpArr[1].trim();
            nlapiSetFieldValue('probability', probability);     
                calculateWeightedMRR(probability);
                calculateWeightedNRR(probability);
                calculateWeightedGP(probability);
            }
        }
        calculateRPU();
    }
}

function calculateWeightedMRR(probability)
{
    probability = probability.replace('%', '') * 1 / 100;
    var estMRR = nlapiGetFieldValue('projectedtotal') * 1;
    nlapiSetFieldValue('weightedtotal', estMRR * probability);
}

function calculateRPU()
{
    var className = nlapiGetFieldText('class');
    var estMRR = nlapiGetFieldValue('projectedtotal') * 1;
    var users = nlapiGetFieldValue('custbodyusers') * 1;

    if (className != 'Parts') {
        if (users > 0) {
            var rpu = estMRR / users * 1;
            nlapiSetFieldValue('custbodyrevenue_per_user', rpu.toFixed(2)); 
        }
    } else {
        nlapiSetFieldValue('custbodyrevenue_per_user', 0); 
    }
}

function calculateWeightedNRR(probability)
{
    probability = probability.replace('%', '') * 1 / 100;
    var nrr = nlapiGetFieldValue('custbodynrr') * 1;
    nlapiSetFieldValue('custbodyweighted_nrr', nrr * probability);
}

function calculateWeightedGP(probability)
{
    probability = probability.replace('%', '') * 1 / 100;
    var gp = nlapiGetFieldValue('custbodygross_profit') * 1;
    nlapiSetFieldValue('custbodyweighted_gp', gp * probability);
}
