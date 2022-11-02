var bcSfSearchSettings = {
    search: {
        
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
};

BCSfFilter.prototype.beforeBuildSearchBox = function (id) {
	
	// Remove theme's instant search events
	var cloneSearchBar = jQ(id).clone();
	jQ(id).replaceWith(cloneSearchBar);

	var self = this;
	if (self.checkIsFullWidthSuggestionMobile(id)) {
		jQ(id).removeAttr('autofocus');
		if (jQ(id).is(':focus')) {
			jQ(id).blur();
		}
	}
};

BCSfFilter.prototype.afterCloseSuggestionMobile = function(searchBoxId, isCloseSearchBox) {
	// Close theme's search pop up
	if (isCloseSearchBox && window.$ && $.fancybox){
		$.fancybox.close(true);
	}
};

