const path = require('path')

module.exports = {
	mode:'development',
	entry:'./main.js',
	output:{
		path:path.resolve(__dirname,'dist'),
		filename:'bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				loader:'babel-loader',
				options:{
					plugins:['@babel/plugin-proposal-class-properties']
				}
			},
			{
				test:/\.scss$/,
				use:['style-loader','css-loader','sass-loader']
			}
		]
	}
}
