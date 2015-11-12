'use strict';
/**
 * Konfiguracja modułu scada
 */
var scada = scada || {};

scada.cf = {

	url : {
		raport : 'raport.html',
		update : 'update.html',
	},

	dom : {
		panel : {
			me : {
				refreshInterval_ms : 1000,
				el : 'pomiary',
				id : '#pomiary',
				cl : ''
			},
			inputs : {
				me : {
					el : 'inputs',
					id : '#inputs',
					cl : ''
				}
			},
			variables : {
				me : {
					el : 'variables',
					id : '#variables',
					cl : ''
				},
				byte : {
					me : {
						el : 'd-byte-input',
						id : '#d-byte-input',
						cl : ''
					}
				},
				int : {
					me : {
						el : 'd-int-input',
						id : '#d-int-input',
						cl : ''
					}
				},
				dint : {
					me : {
						el : 'd-dint-input',
						id : '#d-dinput-input',
						cl : ''
					}
				},
				real : {
					me : {
						el : 'd-real-input',
						id : '#d-real-input',
						cl : ''
					}
				}
			},
			outputs : {
				me : {
					el : 'outputs',
					id : '#outputs',
					cl : ''
				}
			}
		},
	}
}
