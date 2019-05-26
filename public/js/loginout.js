/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-12-03 17:10:58
 * @version $Id$
 */
(function(){
	$.ajax({
		url: "/editor/editorPost",
		type: "POST",
		cache: false,
		dataType: 'json',
		success: function (msg) {
			$('.loginName').text(msg.user.editorName);
			$('.email').text(msg.user.email);
		},
		error: (err)=>{
			console.log(err);
		}
	});
	
})();


$(function(){
	$('.loginout').click(function(){
		$.ajax({
			url: "/editor/loginout",
			type: "POST",
			cache: false,
			dataType: 'json',
			success: function (msg) {
				if (msg) {
					location.href = "/editor/login";
				}
			},
			error: (err)=>{
				console.log(err);
			}
		});
	});
});