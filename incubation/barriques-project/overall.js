var overall_data = {
	"internet" : {
		related: [	"device-desktop1-2-internet", "device-desktop2-2-internet", 
					"device-laptop-2-internet",
				  	"device-ipad-2-internet", "device-iphone-2-internet",
				  	"device-android-2-internet",
				  	"internet-2-server-http",
				  	"internet-text", "internet-impl",
				  	]
	},
	"device-desktop1": {
		related : ["client-side-impl", 
				   "device-desktop1-2-internet", "device-desktop2-2-internet", 
				   "device-laptop-2-internet"
		]
	},
	"device-desktop2": {
		related : ["client-side-impl", 
				   "device-desktop1-2-internet", "device-desktop2-2-internet", 
				   "device-laptop-2-internet"
		]
	},
	"device-laptop": {
		related : ["client-side-impl", 
				   "device-desktop1-2-internet", "device-desktop2-2-internet", 
				   "device-laptop-2-internet"
		]
	},
	"device-ipad": {
		related : ["ipad-impl", "device-ipad-2-internet"]
	},
	"device-iphone" :  {
		related : ["iphone-impl", "device-iphone-2-internet"]
	},
	"device-android-phone" : {
		related : ["android-impl", "device-android-2-internet"]
	},
	"server-http" : {
		related : [ "internet-2-server-http", "server-http-impl", 
					"server-http-2-frontend", "firewall"]
	},
	"client-notif-text" : {
		related : [ "frontend-2-internet", "client-notif-text-impl" ]
	},
	"server-web" : {
		related : [ "frontend-2-internet", "client-notif-text-impl",
					"dice-impl" ]
	},
	"vbox-usb" : {
		related : [ "vbox-content" ]
	},
	"dice" : {
		related : [ "dice-impl", "dice-notes" ]
	},
	"server-service1": {
		related : [ "dice-impl", "fmk-impl", "backend-services-notes" ]	
	},
	"server-service2": {
		related : [ "dice-impl", "fmk-impl", "backend-services-notes" ]	
	},
	"server-service3": {
		related : [ "dice-impl", "fmk-impl", "backend-services-notes" ]	
	},
	"server-service4": {
		related : [ "dice-impl", "fmk-impl", "backend-services-notes" ]	
	},
	"server-service-crash": {
		related  : ["nuke-notes"]
	},
	"server-backoffice" : {
		related : [ "dice-impl", "fmk-impl"]
	},
	"db-crash": {
		related  : ["nuke-notes"]
	},
	"frontend-text" : {
		related : [ "frontend-2-internet", "client-notif-text-impl",
					"dice-impl" ]
	},
	"service-bus" : {
		related : [ "service-bus-impl",
					"server-service4-to-service-bus",
					"service-bus-to-server-service1",
					"service-bus-in", "service-bus-out"]
	},
	"service-bus-text" : {
		related : [ "service-bus-impl"]
	},

	"db1" : {
		related : [ "db-impl", "database-notes" ]
	},
	"db2" : {
		related : [ "db-impl", "database-notes" ]
	},
	"db3" : {
		related : [ "db-impl", "database-notes" ]
	},
	"db4" : {
		related : [ "db-impl", "database-notes" ]
	}

};