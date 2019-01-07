function BeforeLoad(type, form)
{
  form.getField("entitystatus").setDisplayType("hidden");
  form.getField("entityid").setDisplayType("hidden");
  form.getField("isperson").setDisplayType("hidden");
  form.getField("probability").setDisplayType("hidden");
  form.getField("custentitylast_transaction").setDisplayType("hidden");
  form.getField("url").setDisplayType("hidden");
  form.getField("custentity_esc_annual_revenue").setDisplayType("hidden");
  form.getField("custentityuc_mrr").setDisplayType("hidden");
  form.getField("custentitydaas_mrr").setDisplayType("hidden");
  form.getField("custentitymrr").setDisplayType("hidden");
  form.getField("custentity_esc_no_of_employees").setDisplayType("hidden");
  form.getField("custentity_invoice_bulk_email_addr").setDisplayType("hidden");
  
  if (type == 'edit')
  {
      var html = "<style>";
      html += ".pgBntG_new {";
          html += "background:#6ae22c !important;";
          html += "background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZhZmFmYSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+) !important;";
          html += "background: -moz-linear-gradient(top,#6ae22c 0%, #41a528 100%) !important;";
          html += "background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#b1f58e), color-stop(100%,#41a528)) !important;";
          html += "background: -webkit-linear-gradient(top,#6ae22c 0%,#41a528 100%) !important;";
          html += "background: -o-linear-gradient(top,#6ae22c 0%,#41a528 100%) !important;";
          html += "background: -ms-linear-gradient(top,#6ae22c 0%,#41a528 100%) !important;";
          html += "background: linear-gradient(to bottom,#6ae22c 0%,#41a528 100%) !important;";
        html += "border: solid 1px #b2b2b2 !important;"
      html += "}";
      html += ".pgBntG_new:hover {";
         html += "background: #66a954 !important;";
      html += "}";
      html += ".pgBntG_new:active, .pgBntG_new_sel:active {";
         html += "background: #b2b2b2 !important;";
      html += "}";
      html += ".pgBntG_new_sel {";
         html += "background-position: -30px -31px;";
         html += "background: #66a954 !important;";
         html += "border-color: #b2b2b2 !important;";
         html += "color: #333333 !important;";
         html += "font-size: 14px !important;";
         html += "font-weight: 600;";
      html += "}";
      html += ".pgBntG_new_sel:active";
      html += "{";
          html += "box-shadow: 0 0 2px 2px rgba(24,123,242,.75);";
          html += "background: #66a954 !important;";
      html += "}";
      html += "</style>";   
      var htmlPanel = form.addField('custpage_html_panel', 'inlinehtml', 'Html Panel', null, null);
      htmlPanel.setDefaultValue( html );
      form.addButton('custpage_convert_customer', 'Convert to Customer', "convertCustomer()");  
  }
    
  form.setScript('customscript77');
}