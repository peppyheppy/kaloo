/*-----------------------------------------------------
KALOO CONTROL SUITE v. 1
Utilizes the jQuery Library: http://www.jquery.com

Author: Chris Sloan
Website: http://www.chrissloan.info
License: Open Source MIT Licence
-----------------------------------------------------*/
(function ($){
	
	//---------------------------------
	// TABS CLASS
	// use: $(selectors).kaTab(options)
	//---------------------------------
	$.fn.kaTab = function(options){
		
		var options = $.extend({ // set the default options
			defaultTab: ":first", // the detault tab
			tabsClass: "tabs", // the tabs
			activeClass: "active", // what the tab should look like active
			hideAll: false, // should all content be hidden
			hasCloser: false, // has an internal link to close the tab
			internalCloserClass: "tab_closer", // internal link closer class
			useAJAX: false, // should other tabs be loaded via AJAX
			jxContentClass: "jx_content", // where the ajax content is to load
			onComplete: function(){} // any functions needed to be done after completion of AJAX call
		}, options ||{});

		// Set the objects
		var element = $(this);
		var elementID = element.attr("id");
		var tabs = element.find("ul:first." + options.tabsClass + " li a");

		if(location.hash){// Determin if a hash exists in url or not
			tabs.each(function(index){
				if($(this).attr("href") == location.hash){ // does the hash equal any div ID's in the given set?
					options.defaultTab = location.hash;
					return false; // jump out
				}
			});
		}else{
      if (options.defaultTab != ':first' && options.defaultTab.lastIndexOf('#') == -1)
      options.defaultTab = '#' + options.defaultTab;
    }

		if (options.hasCloser){ // set all the internal closers up
			element.find("." + options.internalCloserClass)
				.click(
					function(event){
						element.children("div." + options.contentClass).hide();
			      tabs.parent().removeClass("active");
						return false;
					});
		}
		
		if(options.hideAll){ // should all the tabs be hidden on page load
			tabs.each(function(index){
				element.find($(this).attr("href")).hide();
			});
		}else{
			if (options.defaultTab == ":first" || options.useAJAX){ // make the first tab active
				tabs.each(function(index){
					index == 0 ? $(this).parent().addClass(options.activeClass) : null; // set the first tab with active class
					if(options.useAJAX){
						if (index == 0){
							$(this).attr("id", "tab_" + tabs.index($(this)));
							showAJAX($(this).attr("jxURL"), options.jxContentClass, tabs.index($(this)));
						}
					}else{
						index != 0 ?	element.find($(this).attr("href")).hide() : null; // hide all other tab content but first
					}
				});
			}else{ // make the tab with hash active and show accordingly
				tabs.each(function(index){
					if(options.defaultTab == $(this).attr("href")){
						$(this).parent().addClass(options.activeClass);
					}else{
						element.find($(this).attr("href")).hide();
					}
				});
			}
		}
		
		// event handler
		tabs.click(
			function(event){
				if(options.useAJAX){
					if($(this).attr("id")){ // if an ID on the link has been set
						showContent(tabs.index($(this))); // show based on DOM already loaded
					}else{ // show based on AJAX call
						$(this).attr("id", "tab_" + tabs.index($(this)));
						showAJAX($(this).attr("jxURL"), options.jxContentClass, tabs.index($(this)));
					}
				}else{
					var theDiv = $(this).attr("href"); // grab the url for corresponding div
					tabs.each(function(index){
						element.find($(this).attr("href")).hide();
					});
					element.find(theDiv).show();
				}
			
				tabs.parent().removeClass(options.activeClass);
				$(this).parent().addClass(options.activeClass);
				return false; // stop the page jump
			}
		);
		
		function showContent(tab_index){ // For AJAX loaded content already in the DOM
			$("."+ elementID + "_loaded").each(function(){
				$(this).hide();
			});
			$("."+ elementID + "_content_" + tab_index).show();
		}
		
		function showAJAX(url, content, tab_index){
			$("."+ elementID + "_loaded").each(function(){
				$(this).hide();
			});
			$(element).find(".jx_loader").show(); // make it so it works on multiple boxes!!
			$(element).find("." + content).show().fadeTo("normal", 0.2).load(
				url, 
				{}, 
				function(){
					$(element).find(".jx_loader").hide();
					$(element).find("." + content).hide().clone().show().insertAfter(this).removeClass(content).addClass(elementID +"_loaded " + elementID + "_content_" + tab_index).fadeTo("fast", 1); // clone the loaded div and place into the DOM for no AJAX re-call
					options.onComplete.call(self); // Any functions to call after completion
				}
			);
			
		}
	}
	
	//---------------------------------
	// EXPAND CLASS
	// use: $(selectors).kaTab(options)
	//---------------------------------
	$.fn.kaPand = function(options){
		
		var options = $.extend({ // set the default options
			togglerClass: "kaPander",
			expandedClass: "expanded",
			hiddenElementClass: "hidden_element",
			toggledClass: "is_showing",
			hideText: "...show less"
		}, options ||{});
		
		var initialText;
		
		$(this).find("." + options.hiddenElementClass).hide();
		
		$(this).find("." + options.togglerClass).click(
			function(event){
				!$(this).hasClass(options.toggledClass) ? initialText = $(this).text() : null;
				$(this).prev("." + options.hiddenElementClass).toggle("blind");
				$(this).hasClass(options.toggledClass) ? $(this).html(initialText).removeClass(options.toggledClass) : $(this).html(options.hideText).addClass(options.toggledClass);
			}
		);
	}
	
	
	//---------------------------------
	// TOGGLER CLASS
	// use: $(selectors).kaTab(options)
	//---------------------------------
	$.fn.kaTog = function(options){
		
		var options = $.extend({ // set the default options
			togglerClass: "kaTogger",
			expandedClass: "expanded",
			hiddenElementClass: "hidden_element",
			toggledClass: "is_showing",
			hideText: "...show less"
		}, options ||{});
		
		var initialText;
		
		$(this).find("." + options.hiddenElementClass).hide();
		
		$(this).find("." + options.togglerClass).click(
			function(event){
				$($(this).attr("href")).toggle("blind");
				return false;
			}
		);
	}
	
	
	//-----------------------------
	// Easy centering class
	// (centers objects in viewport)
	//-----------------------------
	$.fn.kaCenter = function(options) {
	    var pos = {
	      sTop : function() {
	        return window.pageYOffset
	        || document.documentElement && document.documentElement.scrollTop
	        ||  document.body.scrollTop;
	      },
	      wHeight : function() {
	        return window.innerHeight
	        || document.documentElement && document.documentElement.clientHeight
	        || document.body.clientHeight;
	      },
				sLeft : function() {
	        return window.pageXOffset
	        || document.documentElement && document.documentElement.scrollLeft
	        ||  document.body.scrollLeft;
	      },
	      wWidth : function() {
	        return window.innerWidth
	        || document.documentElement && document.documentElement.clientWidth
	        || document.body.clientWidth;
	      }
	    };
	    return this.each(function(index) {
	      if (index == 0) {
	        var $this = $(this);
	        var elHeight = $this.height();
					var elWidth = $this.width();
	        var elTop = pos.sTop() + (pos.wHeight() / 2) - (elHeight / 2);
					var elLeft = pos.sLeft() + (pos.wWidth() / 2) - (elWidth / 2);	
	        $this.css({
	          position: 'absolute',
	          marginTop: '0',
	          top: elTop,
						left: elLeft
	        });
	      }
	    });
	  };
	
	//-----------------------------
	// TAGGER CLASS
	//-----------------------------
	$.fn.kaTagger = function(options) {
		var options = $.extend({ // set the default options
			tagsContainerClass: "tags_list",
			selectedClass: "selected",
			togglerClass: "toggle_link",
			moreTagsID: "more_tags",
			fakeInput: "fake_input"
		}, options ||{});
	
		var tags = $("." + options.tagsContainerClass).find(".tag");
		var tagsInput = $(this);
		var fakeInput = $("#" + options.fakeInput); // So that you cant type tags in
		var inputValue = tagsInput.val();
		var fakeValue = fakeInput.val();
		var toggleLink = $("." + options.tagsContainerClass).find("." + options.togglerClass);
		var moreTags = $("#" + options.moreTagsID);
		
		checkInput(); // lets select all the stuff first
		
		toggleLink.click(function(){
			$(moreTags).toggle();
			$(moreTags).css("display") != "none" ? toggleLink.html("&laquo; show less") : toggleLink.html("show more &raquo;");
		});
		
		tags.click(function(){
			var tagText = $(this).text();
			
			if($(this).hasClass(options.selectedClass)){
				if (inputValue == tagText){
					tagsInput.val("");
					fakeInput.val("");
				}else if (inputValue.beginsWith(tagText)){
					tagsInput.val(inputValue.replace(tagText + ", ", ""));
					fakeInput.val(inputValue.replace(tagText + ", ", ""));
				}else{
					tagsInput.val(inputValue.replace(", " + tagText, ""));
					fakeInput.val(inputValue.replace(", " + tagText, ""));
				}
				$(this).removeClass(options.selectedClass);
				
			}else{
				inputValue == "" ? tagsInput.val(tagText) : tagsInput.val(inputValue + ", " + tagText);
				fakeValue == "" ? fakeInput.val(tagText) : fakeInput.val(inputValue + ", " + tagText);
				$(this).addClass(options.selectedClass);
			}
			
			inputValue = tagsInput.val();
			fakeValue = fakeInput.val();
		});
		
		function checkInput(){

			var currentInput = inputValue.replace(/, /g, ","); //Remove space, but keep the 
			currentInput = currentInput.replace(/ /g, '_'); //For any tag that might be multiple words with a space
	    currentInput = currentInput.replace(/,/g, ' '); //Ready the transformed string for the array
			var inputArray = new Array();
			inputArray = currentInput.split(" ");
			
			$.each(inputArray, function(n, value){
				tags.each(function(){
					$(this).text().replace(/ /g, '_') == value ? $(this).addClass("selected") : null;
				});
			});
		}
		
	}
	
	//---------------------------------
	// SLIDER CLASS
	// use: $(selectors).kaSlider(options)
	//---------------------------------
	$.fn.kaSlider = function(options){
		
		var options = $.extend({ // set the default options
			sliderHolderClass: "slider_holder",
			sliderTrackClass: "slider_track",
			sliderElementClass: "slider_item",
			sliderNextButton: "slider_next",
			sliderPreviousButton: "slider_previous",
			slideBy: 1,
			autoSlide: false,
			currentItemClass: "current_item",
			useTabs: false,
			sliderTabsClass: "slider_tabs",
			selectedTabClass: "highlighted"
		}, options ||{});
		
		var element = $(this);
		var sliderHolder = element.find("." + options.sliderHolderClass).css({position:"relative", overflow:"hidden"});
		var sliderTrack = element.find("." + options.sliderTrackClass).css({position:"absolute"});
		var nextButton = element.find("." + options.sliderNextButton);
		var prevButton = element.find("." + options.sliderPreviousButton);
		var items = element.find("." + options.sliderElementClass);
		
		var wSlideBy = items.width() * options.slideBy; // Amount that the slider slides each click
		var wSliderTrack = items.width() * items.size(); // Width of track
		var wTotal =  (wSlideBy * (Math.ceil(wSliderTrack / wSlideBy))) - wSlideBy; // Complete length of track compensation
		var hSliderTrack = 0;
		var currentPosition = 0;
		var itemIndex = 0;

		if(options.useTabs){
			options.slideBy = 1;
			var tabs = element.find('.' + options.sliderTabsClass + " li a");
			$(tabs[0]).addClass(options.selectedTabClass);
				$(tabs).click(function(){
					tabs.removeClass(options.selectedTabClass);
					$(this).addClass(options.selectedTabClass);
					var index = tabs.index(this) + 1;
					moveByTab(index);
				});
		}
		
		setupSlider(); // run and create the visuals
		
		nextButton.click(slideNext);
		prevButton.click(slidePrevious);
		
		if(options.autoSlide){ // for sliding directly to an item
		  items.each(function(index){
		    if($(this).hasClass(options.currentItemClass)){ // find where the item is currently selected
		      itemIndex = index; 
		    }
		  });
		  autoSlide(); // slide to the current item
		}
		
		function autoSlide(){ // have slider slide on load and move to current item
			var moveTo = Math.floor(itemIndex / options.slideBy) * wSlideBy;
			sliderTrack.animate({left:-moveTo + "px"}, 500);
		}
		
		function slideNext(){ // slide forward
			if(options.useTabs){ // for setting the current tab class
				var tabIndex = Math.abs(sliderTrack.position().left / wSlideBy) + 1;
				if(tabIndex == tabs.size()){
					tabIndex = 0;
				}
				tabs.removeClass(options.selectedTabClass);
				$(tabs[tabIndex]).addClass(options.selectedTabClass);
			}
			if(currentPosition == wTotal){
				sliderTrack.animate({left:"0"}, 500);
				currentPosition = 0;
			}else{
				sliderTrack.animate({left:"-=" + wSlideBy + "px"}, 500);
				currentPosition = currentPosition + wSlideBy;
			}
			return false;
		}
		
		function slidePrevious(){ // slide backward
			
			if(options.useTabs){ // for setting the current tab class
				var tabIndex = Math.abs(sliderTrack.position().left / wSlideBy) - 1;
				if(tabIndex < 0){
					tabIndex = tabs.size() - 1;
				}
				tabs.removeClass(options.selectedTabClass);
				$(tabs[tabIndex]).addClass(options.selectedTabClass);
			}
			
			if(currentPosition == 0){
				sliderTrack.animate({left:-wTotal + "px"}, 500);
				currentPosition = wTotal;
			}else{
				sliderTrack.animate({left:"+=" + wSlideBy + "px"}, 500);
				currentPosition = currentPosition - wSlideBy;
			}
			return false;
		}
		
		function setupSlider(){ // setup the visuals
			items.each(function(){
				if($(this).height() > hSliderTrack){
					hSliderTrack = $(this).height();
				}
			});

			sliderTrack.css({height: hSliderTrack + "px", width: wSliderTrack + "px"});
			sliderHolder.css({height: hSliderTrack + "px", width: wSlideBy + "px"});
		}
				
		
		function moveByTab(index){
			//console.log("Index: " + index);
			var tabbedPosition = sliderTrack.position().left;
			var currentIndex = Math.abs(tabbedPosition / wSlideBy) + 1;
			//console.log("Current: " + currentIndex);
			var theIndex = index - currentIndex;
			var moveBy = theIndex * wSlideBy;

			sliderTrack.animate({left:"-="+moveBy + "px"}, 500);
			currentPosition = currentPosition + moveBy;
		}
	

	}
	
	//-----------------------------
	// WINDOW SCROLLER BUILDER
	//-----------------------------
	$.fn.scrollWindow = function(options){
		
		var options = $.extend({
			duration: 800 // how quick is it
		}, options || {} );
		
		$(this).click(function(){
			$.scrollTo($(this).attr("href"), options.duration);
			return false;
		});
		
	}
	
})(jQuery);

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 9/11/2008
 * @author Ariel Flesler
 * @version 1.4
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(h){var m=h.scrollTo=function(b,c,g){h(window).scrollTo(b,c,g)};m.defaults={axis:'y',duration:1};m.window=function(b){return h(window).scrollable()};h.fn.scrollable=function(){return this.map(function(){var b=this.parentWindow||this.defaultView,c=this.nodeName=='#document'?b.frameElement||b:this,g=c.contentDocument||(c.contentWindow||c).document,i=c.setInterval;return c.nodeName=='IFRAME'||i&&h.browser.safari?g.body:i?g.documentElement:this})};h.fn.scrollTo=function(r,j,a){if(typeof j=='object'){a=j;j=0}if(typeof a=='function')a={onAfter:a};a=h.extend({},m.defaults,a);j=j||a.speed||a.duration;a.queue=a.queue&&a.axis.length>1;if(a.queue)j/=2;a.offset=n(a.offset);a.over=n(a.over);return this.scrollable().each(function(){var k=this,o=h(k),d=r,l,e={},p=o.is('html,body');switch(typeof d){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(d)){d=n(d);break}d=h(d,this);case'object':if(d.is||d.style)l=(d=h(d)).offset()}h.each(a.axis.split(''),function(b,c){var g=c=='x'?'Left':'Top',i=g.toLowerCase(),f='scroll'+g,s=k[f],t=c=='x'?'Width':'Height',v=t.toLowerCase();if(l){e[f]=l[i]+(p?0:s-o.offset()[i]);if(a.margin){e[f]-=parseInt(d.css('margin'+g))||0;e[f]-=parseInt(d.css('border'+g+'Width'))||0}e[f]+=a.offset[i]||0;if(a.over[i])e[f]+=d[v]()*a.over[i]}else e[f]=d[i];if(/^\d+$/.test(e[f]))e[f]=e[f]<=0?0:Math.min(e[f],u(t));if(!b&&a.queue){if(s!=e[f])q(a.onAfterFirst);delete e[f]}});q(a.onAfter);function q(b){o.animate(e,j,a.easing,b&&function(){b.call(this,r,a)})};function u(b){var c='scroll'+b,g=k.ownerDocument;return p?Math.max(g.documentElement[c],g.body[c]):k[c]}}).end()};function n(b){return typeof b=='object'?b:{top:b,left:b}}})(jQuery);
