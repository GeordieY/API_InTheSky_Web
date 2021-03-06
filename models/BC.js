var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('12kye8bBKnnTjgSp_0TMz5U3H1ArV7hmMNsz79L3qmI8');
var BCapiKey="IdPuT2Or";

exports.getBCData = function(name, callback){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(2, function (err, rows) {
      callback(rows.filter(function(current){return name==current["userid"];}));
    });
  });
}

exports.addBCData = function(id, name, object, callback){
    object["userid"]=id;
    object["name"]=name;
    	doc.useServiceAccountAuth(creds, function (err) {
    		doc.addRow(2, object, callback);
    	});
}
