exports.pages = function(req, res){
	var page_name = req.params.page;
	if (page_name == 'chart') {
		res.render('chart',
		{
			title         :'D3 Charts' ,
			description   :'Playing with D3 Charts - Technical Phase #1',
			keywords      :'d3 charts',
		});
	}
	else if (page_name == 'save') {
		res.render('save',
		{
			title         :'D3 Charts' ,
			description   :'JSON 2 File',
			keywords      :'weather api to feed',
		});
	}

};

