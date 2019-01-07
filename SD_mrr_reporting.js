function scheduled( type )
{ 
    massEmptyMRR();
    massTotalMRR();
    massUCMRR();
    massDaaSMRR();
}

function massEmptyMRR() {

  try {
      // resultIndex points to record starting current resultSet in the entire results array
      var search = nlapiLoadSearch( 'customer', 'customsearch330' );
      var searchResults = search.runSearch();
      var cols = search.getColumns();
      // resultIndex points to record starting current resultSet in the entire results array
      var resultIndex = 0;
      var resultStep = 100; // Number of records returned in one step (maximum is 1000)
      var resultSet; // temporary variable used to store the result set

      do
      {
        
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
      
        for ( var i = 0; i < resultSet.length; i++ ) {

            var element = resultSet[i];
            var customerId = element.getId();
            var customerRec = nlapiLoadRecord('customer', customerId);
            customerRec.setFieldValue('custentityuc_mrr', null);
            customerRec.setFieldValue('custentitydaas_mrr', null);
            customerRec.setFieldValue('custentitymrr', null);
            nlapiSumitRecord(customerRec, false, true);
            checkGovernance();
        }

       resultIndex = resultIndex + resultStep;
     
      } while (resultSet.length > 0);

  } catch ( error ) {

    if ( error.getDetails != undefined ) {
      nlapiLogExecution( "error", "Empty - Process Error", error.getCode() + ":" + error.getDetails() );
    } else {
      nlapiLogExecution( "error", "Empty - Unexpected Error", error.toString() );
    }

  }

}

function massTotalMRR() {

  try {
      // resultIndex points to record starting current resultSet in the entire results array
      var search = nlapiLoadSearch( 'transaction', 'customsearch_thisperiod_mrr_report' );
      var searchResults = search.runSearch();
      var cols = search.getColumns();
    
      // resultIndex points to record starting current resultSet in the entire results array
      var resultIndex = 0;
      var resultStep = 100; // Number of records returned in one step (maximum is 1000)
      var resultSet; // temporary variable used to store the result set

      var allCount = 0;
      do
      {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
      
        for ( var i = 0; i < resultSet.length; i++ ) {

            var element = resultSet[i];
            var customerId = element.getValue(cols[0]);
            var customerName = element.getText(cols[0]);
            var mrrVal = element.getValue(cols[1]);
            nlapiSubmitField('customer', customerId, 'custentitymrr', Math.round( mrrVal * 1 ));
      /*      if( (i % 5) == 0 ) {
              setRecoveryPoint();
            }*/
            allCount ++;
            nlapiLogExecution('Debug', allCount, 'Total MRR ' + customerName + ' ->' + mrrVal);
            checkGovernance();
        }

       resultIndex = resultIndex + resultStep;
     
      } while (resultSet.length > 0);

  } catch ( error ) {

    if ( error.getDetails != undefined ) {
      nlapiLogExecution( "error", "Total MRR Process Error", error.getCode() + ":" + error.getDetails() );
    } else {
      nlapiLogExecution( "error", "Total MRR Unexpected Error", error.toString() );
    }

  }

}

function massUCMRR() {

  try {
      // resultIndex points to record starting current resultSet in the entire results array
      var search = nlapiLoadSearch( 'transaction', 'customsearch_thisperiod_mrr_report_4' );
      var searchResults = search.runSearch();
      var cols = search.getColumns();
    
      // resultIndex points to record starting current resultSet in the entire results array
      var resultIndex = 0;
      var resultStep = 100; // Number of records returned in one step (maximum is 1000)
      var resultSet; // temporary variable used to store the result set

      var allCount = 0;
      do
      {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
      
        for ( var i = 0; i < resultSet.length; i++ ) {

            var element = resultSet[i];
            var customerId = element.getValue(cols[0]);
            var customerName = element.getText(cols[0]);
            var mrrVal = element.getValue(cols[1]);
            nlapiSubmitField('customer', customerId, 'custentityuc_mrr', Math.round( mrrVal * 1 ));
      /*      if( (i % 5) == 0 ) {
              setRecoveryPoint();
            }*/
            allCount ++;
            nlapiLogExecution('Debug', allCount, 'UC MRR ' + customerName + ' ->' + mrrVal);
            checkGovernance();
        }

       resultIndex = resultIndex + resultStep;
     
      } while (resultSet.length > 0);

  } catch ( error ) {

    if ( error.getDetails != undefined ) {
      nlapiLogExecution( "error", "UC MRR Process Error", error.getCode() + ":" + error.getDetails() );
    } else {
      nlapiLogExecution( "error", "UC MRR Unexpected Error", error.toString() );
    }

  }

}

function massDaaSMRR() {

  try {
      // resultIndex points to record starting current resultSet in the entire results array
      var search = nlapiLoadSearch( 'transaction', 'customsearch_thisperiod_mrr_report_4_2' );
      var searchResults = search.runSearch();
      var cols = search.getColumns();
    
      // resultIndex points to record starting current resultSet in the entire results array
      var resultIndex = 0;
      var resultStep = 100; // Number of records returned in one step (maximum is 1000)
      var resultSet; // temporary variable used to store the result set

      var allCount = 0;
      do
      {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
      
        for ( var i = 0; i < resultSet.length; i++ ) {

            var element = resultSet[i];
            var customerId = element.getValue(cols[0]);
            var customerName = element.getText(cols[0]);
            var mrrVal = element.getValue(cols[1]);
            nlapiSubmitField('customer', customerId, 'custentitydaas_mrr', Math.round( mrrVal * 1 ));
        /*    if( (i % 5) == 0 ) {
              setRecoveryPoint();
            }*/
            allCount ++;
            nlapiLogExecution('Debug', allCount, 'DaaS MRR ' + customerName + ' ->' + mrrVal);
            checkGovernance();
        }

       resultIndex = resultIndex + resultStep;
     
      } while (resultSet.length > 0);

  } catch ( error ) {

    if ( error.getDetails != undefined ) {
      nlapiLogExecution( "error", "DaaS MRR Process Error", error.getCode() + ":" + error.getDetails() );
    } else {
      nlapiLogExecution( "error", "DaaS MRR Unexpected Error", error.toString() );
    }

  }

}

function checkGovernance()
{
 var context = nlapiGetContext();
 if( context.getRemainingUsage() < 200 )
 {
    var state = nlapiYieldScript();
    if( state.status == 'FAILURE')
    {
        nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
        throw "Failed to yield script";
    } 
    else if ( state.status == 'RESUME' )
    {
         nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
    }
  // state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 }
}

function setRecoveryPoint()
{
 var state = nlapiSetRecoveryPoint(); //100 point governance
 if( state.status == 'SUCCESS' ) {
    nlapiLogExecution("Audit", "Recovery Point Success");
    return;  //we successfully create a new recovery point
 }
 if( state.status == 'RESUME' ) //a recovery point was previously set, we are resuming due to some unforeseen error
 {
    nlapiLogExecution("ERROR", "Resuming script because of " + state.reason+".  Size = "+ state.size);
 //   handleScriptRecovery();
 }
 else if ( state.status == 'FAILURE' )  //we failed to create a new recovery point
 {
     nlapiLogExecution("ERROR","Failed to create recovery point. Reason = "+state.reason + " / Size = "+ state.size);
     handleRecoveryFailure(state);
 }
}

function handleRecoverFailure(failure)
{
     if( failure.reason == 'SS_MAJOR_RELEASE' ) throw "Major Update of NetSuite in progress, shutting down all processes";
     if( failure.reason == 'SS_CANCELLED' ) throw "Script Cancelled due to UI interaction";
     if( failure.reason == 'SS_EXCESSIVE_MEMORY_FOOTPRINT' ) { cleanUpMemory(); setRecoveryPoint(); }//avoid infinite loop
     if( failure.reason == 'SS_DISALLOWED_OBJECT_REFERENCE' ) throw "Could not set recovery point because of a reference to a non-recoverable object: "+ failure.information; 
}

function cleanUpMemory(){
     nlapiLogExecution("Debug", "Cleanup_Memory", "Cleanup_Memory");
}