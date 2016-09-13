		
	var Menu = {
	  
	el: {
		ham: $('.menu'),
		menuTop: $('.menu-top'),
		menuMiddle: $('.menu-middle'),
		menuBottom: $('.menu-bottom')
	  },
	  
	  init: function() {
		Menu.bindUIactions();
	  },
	  
	  bindUIactions: function() {
		Menu.el.ham
			.on(
			  'click',
			function(event) {
			Menu.activateMenu(event);
			event.preventDefault();
		  }
		);
	  },
	  
	  activateMenu: function() {
		Menu.el.menuTop.toggleClass('menu-top-click');
		Menu.el.menuMiddle.toggleClass('menu-middle-click');
		Menu.el.menuBottom.toggleClass('menu-bottom-click'); 
	  }
	};

	Menu.init();
	$("#menutext").click(function(){
	Menu.activateMenu();
	if($("#menu").is(":visible"))
	{$("#menu").slideUp(650);$("#cover").slideUp(650)}
	else{$("#menu").slideDown(650);$("#cover").slideDown(650)}});
	$("#menuButton").click(function(){
	if($("#menu").is(":visible"))
	{$("#menu").slideUp(650);$("#cover").slideUp(650)}
	else{$("#menu").slideDown(650);$("#cover").slideDown(650)}});
