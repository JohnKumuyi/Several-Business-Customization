function BeforeLoad(type, form)
{
  form.getField("tranid").setDisplayType("hidden");
  form.getField("entitystatus").setDisplayType("hidden");
  form.getField("forecasttype").setDisplayType("hidden");
  form.getField("rangelow").setDisplayType("hidden");
  form.getField("rangehigh").setDisplayType("hidden");
  form.getField("custpage_lsa_vis").setDisplayType("hidden");
  form.getField("custbody_esc_created_date").setDisplayType("hidden");
  form.getField("custbody_esc_last_modified_date").setDisplayType("hidden");
  form.getField("currency").setDisplayType("hidden");
  form.getField("exchangerate").setDisplayType("hidden");
  
  form.setScript('customscript79');
  var itemSublist = form.getSubList('item');
  itemSublist.setDisplayType('hidden');
}