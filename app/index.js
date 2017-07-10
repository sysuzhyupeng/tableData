require('../resource/less/main.less');
var CrimeTable = require('./main');
var crimeTable = new CrimeTable();
crimeTable.init({
	api: '',
	tmplUlClass: 'fit-table-row'
});