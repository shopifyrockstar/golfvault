// Override Settings
var bcSfFilterSettings = {
	general: {
		limit: bcSfFilterConfig.custom.products_per_page,
		/* Optional */
		loadProductFirst: true,
		paginationType: bcSfFilterConfig.custom.pagination_type.indexOf("load_more") != -1 ? "load_more" :
						(bcSfFilterConfig.custom.pagination_type == 'infinite_scroll' ? 'infinite' : 'default'),
	}
};
// Declare Templates
var bcSfFilterTemplate = {
	// Grid Template
	'productGridItemHtml': '<div class="{{itemDesktopWidthClass}} medium-down--one-half {{itemMobileWidthClass}} column {{itemQuickShopClass}} {{itemStickersClass}}' +
						    ' thumbnail product__thumbnail product__grid-item' +
						    ' thumbnail__hover-overlay--{{itemHoverClass}}' +
						    ' has-padding-bottom">' +
						    	'<div class="product-wrap {{itemSwapImageClass}}">' +
						    	    '<div class="product-image__wrapper">' +
						    	        '<div class="image__container product__imageContainer">' +
						    	            '<a href="{{itemUrl}}">' +
						    	                '{{itemStickers}}' +
						    	                '{{itemImages}}' +
						    	            '</a>' +
						    	        '</div>' +
						    	        '{{itemHover}}' +
						    	    '</div>' +
						    	    '<div class="thumbnail__caption text-align-{{itemTextAlignClass}}">' +
						    	        '{{itemProductInfo}}' +
						    	    '</div>' +
						    	'</div>' +
						    	'{{itemSwatch}}' +
						    	'{{itemReviews}}' +
							'</div>',
	
	'itemHoverHtml' : '<div class="thumbnail-overlay__container">' +
						    '<a class="hidden-product-link" href="{{itemUrl}}">{{itemTitle}}</a>' +
							'{{itemProductInfoHover}}' +
							'{{itemQuickShop}}' +
						    '{{itemReviewsHover}}' +
						'</div>',

	'itemProductInfoHtml': '<div class="product-thumbnail">' +
								'{{itemVendor}}' +
								'<a href="{{itemUrl}}" class="product-thumbnail__title">{{itemTitle}}</a>' +
								'{{itemComingSoon}}' +
								'{{itemPrice}}' +
							'</div>',
	
	// Pagination Template
	'previousActiveHtml': '<a href="{{itemUrl}}" class="pagination-previous">'+ bcSfFilterConfig.label.previous +'</a>',
	'nextActiveHtml': '<a href="{{itemUrl}}" class="pagination-next">'+ bcSfFilterConfig.label.next +'</a>',
	'pageItemHtml': '<li><a class="pagination-link" href="{{itemUrl}}">{{itemTitle}}</a></li>',
	'pageItemSelectedHtml': '<li><a class="pagination-link is-current">{{itemTitle}}</a></li>',
	'pageItemRemainHtml': '<li><a class="pagination-ellipsis">…</a></li>',
	'paginateHtml': '<nav class="pagination paginate--both" role="navigation" aria-label="pagination">{{previous}}<ul class="pagination-list">{{pageItems}}</ul>{{next}}</nav>',

	// Sorting Template
	'sortingHtml': '<select aria-label="Sort by" class="sort_by">{{sortingItems}}</select>',
};

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data) {
	// Get Template
	var itemHtml = bcSfFilterTemplate.productGridItemHtml;

	// Add class
	var itemDesktopWidthClass = 'one-third';
	switch (bcSfFilterConfig.custom.products_per_row){
			case 1: itemDesktopWidthClass = 'one-whole'; break;
			case 2: itemDesktopWidthClass = 'one-half'; break;
			case 3: itemDesktopWidthClass = 'one-third'; break;
			case 4: itemDesktopWidthClass = 'one-fourth'; break;
			case 5: itemDesktopWidthClass = 'one-fifth'; break;
			case 6: itemDesktopWidthClass = 'one-sixth'; break;
			case 7: itemDesktopWidthClass = 'one-seventh'; break;
			case 8: itemDesktopWidthClass = 'one-eighth'; break;
	}
	itemHtml = itemHtml.replace(/{{itemDesktopWidthClass}}/g, itemDesktopWidthClass);
	itemHtml = itemHtml.replace(/{{itemMobileWidthClass}}/g, bcSfFilterConfig.custom.mobile_products_per_row == 1 ? 'small-down--one-whole' : 'small-down--one-half');
	itemHtml = itemHtml.replace(/{{itemQuickShopClass}}/g, bcSfFilterConfig.custom.enable_quickshop ? 'quick-shop--true quick-shop--closed product-{{itemId}} js-product_section' : '');
	itemHtml = itemHtml.replace(/{{itemStickersClass}}/g, bcSfFilterConfig.custom.stickers_enabled ? 'has-thumbnail-sticker' : '');
	itemHtml = itemHtml.replace(/{{itemHoverClass}}/g, bcSfFilterConfig.custom.thumbnail_hover_enabled.toString());
	itemHtml = itemHtml.replace(/{{itemSwapImageClass}}/g, bcSfFilterConfig.custom.show_secondary_image && data.images_info.length > 1 ? 'swap--true' : '');
	itemHtml = itemHtml.replace(/{{itemTextAlignClass}}/g, bcSfFilterConfig.custom.thumbnail_text_alignment);

	// Add stickers
	var itemStickers = buildStickers(data);
	itemHtml = itemHtml.replace(/{{itemStickers}}/g, itemStickers);

	// Add images
	var itemImages = buildImages(data);
	itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImages);

	// Add hover elements
	var itemHover = buildHover(data);
	itemHtml = itemHtml.replace(/{{itemHover}}/g, itemHover);

	// Add product info
	itemHtml = itemHtml.replace(/{{itemProductInfo}}/g, bcSfFilterTemplate.itemProductInfoHtml);

	// Add vendor
	var itemVendor = bcSfFilterConfig.custom.display_vendor ? '<span class="product-thumbnail__vendor">{{itemVendor}}</span>' : '';
	itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendor);

	var collectionHandles = data.collections.map(x => x.handle);
	var isComingSoon = collectionHandles.indexOf('coming-soon') != -1;
	// Add coming soon
	if (isComingSoon){
		itemHtml = itemHtml.replace(/{{itemComingSoon}}/g, '<span>' + bcSfFilterConfig.label.coming_soon + '</span>');
		itemHtml = itemHtml.replace(/{{itemPrice}}/g, '');

	// Add price
	} else {
		itemHtml = itemHtml.replace(/{{itemComingSoon}}/g, '');
		itemHtml = itemHtml.replace(/{{itemPrice}}/g, buildPrice(data));
	}

	// Add swatch
	var itemSwatch = buildSwatch(data);
	itemHtml = itemHtml.replace(/{{itemSwatch}}/g, itemSwatch);

	// Add reviews
	var itemReviews = bcSfFilterConfig.custom.enable_shopify_collection_badges && bcSfFilterConfig.custom.enable_shopify_review_comments ? '<span class="shopify-product-reviews-badge" data-id="{{itemId}}"></span>' : '';
	if (bcSfFilterConfig.custom.thumbnail_hover_enabled){
		itemHtml = itemHtml.replace(/{{itemReviewsHover}}/g, itemReviews);
		itemHtml = itemHtml.replace(/{{itemReviews}}/g, '');
	} else {
		itemHtml = itemHtml.replace(/{{itemReviewsHover}}/g, '');
		itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemReviews);
	}

	// Add quick shop button placeholder
	var itemQuickShop = bcSfFilterConfig.custom.enable_quickshop ? '<div data-bc-sf-quickshop-id="{{itemId}}" style="display: none"></div>' : '';
	itemHtml = itemHtml.replace(/{{itemQuickShop}}/g, itemQuickShop);

	// Add main attribute (Always put at the end of this function)
	itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
	itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
	itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
	itemHtml = itemHtml.replace(/{{itemVendor}}/g, data.vendor);
	itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));
	return itemHtml;
};

function buildStickers(data){
	var html = '';
	var stickers = [];
	if (bcSfFilterConfig.custom.stickers_enabled){
		var collections = data.collections.map(x => x.handle);
		var stickerCollections = ['best-seller', 'coming-soon', 'new', 'pre-order', 'staff-pick'];
		for (var i = 0; i < stickerCollections.length; i++){
			var stickerCollection = stickerCollections[i];
			if (collections.indexOf(stickerCollection) != -1){
				var stickerText = bcSfFilterConfig.label[stickerCollection.replace('-', '_')];
				var sticker = '<div class="'+ stickerCollection +'-sticker thumbnail-sticker sticker-'+ i +'"><span class="sticker-text">' + stickerText + '</span></div>';
				stickers.push(sticker);
			}
		}

		var onSale = data.available && data.price_min < data.compare_at_price_max;
		if (onSale){
			var sticker = '<div class="sale-sticker thumbnail-sticker"><span class="sticker-text">' + bcSfFilterConfig.label.sale + '</span></div>';
			stickers.push(sticker);
		}

		if (stickers.length > 0){
			html = 	'<div class="sticker-holder sticker-shape-'+ bcSfFilterConfig.custom.sticker_shape +' sticker-position-'+ bcSfFilterConfig.custom.sticker_position +'">' +
						'<div class="sticker-holder__content sticker-holder__content--">' +
							stickers.join('') +
						'</div>'+
					'</div>';
		}		
	}
	return html;
}

function buildImages(data){
	var html = '';
	var images = data.images_info;
	if (!images || images.length == 0){
		images.push({
			src: bcSfFilterMainConfig.general.no_image_url,
			width: 480,
			height: 480
		})
	}

	html += buildImageElement(images[0]);
	
	if (bcSfFilterConfig.custom.show_secondary_image && images.length > 1){
		html += buildImageElement(images[1], 'lazypreload secondary swap--visible');
	}

	return html;
}

function buildImageElement(image, additionalClass) {
	var additionalClass = (typeof additionalClass !== 'undefined') ? additionalClass : '';
	var html = '';
	var heightStyle = '';
	var widthStyle = '';
	var aspectRatio = image.width / image.height;
	if (bcSfFilterConfig.custom.align_height){
		heightStyle += 'max-height: ' + bcSfFilterConfig.custom.collection_height + 'px;';
		widthStyle += 'width: '+ (aspectRatio * bcSfFilterConfig.custom.collection_height) +'px; max-width: '+ image.width +'px;';
	}
	
	var backgroundColor = bcSfFilterConfig.custom.image_loading_style == 'color' ? 'background: url('+ bcsffilter.optimizeImage(image.src, '1x') +'); ' : '';
	var lowQualityImage = bcSfFilterConfig.custom.image_loading_style == 'blur-up' ? bcsffilter.optimizeImage(image.src, '50x') : '';
	
	html += '<div class="image-element__wrap" style="' + backgroundColor + heightStyle + widthStyle + '">' +
				'<img alt="{{itemTitle}}"'+
					' class="lazyload transition--'+ bcSfFilterConfig.custom.image_loading_style + ' ' + additionalClass + '"'+
					(lowQualityImage ? 
					' src="' + lowQualityImage + '"' : '' ) +
					' data-src="'+ bcsffilter.optimizeImage(image.src, '1600x') +'"'+
					' data-sizes="auto"'+
					' data-aspectratio="' + aspectRatio +'"'+
					' data-srcset="' + bgset(image) +'"'+
					' height="'+ image.height +'"'+
					' width="'+ image.width +'"'+
					' style="'+ heightStyle +'"'+
				'/>' +
			'</div>';
	return html;
}

function buildHover(data){
	var html = '';
	if (bcSfFilterConfig.custom.enable_quickshop || bcSfFilterConfig.custom.thumbnail_hover_enabled){
		html = bcSfFilterTemplate.itemHoverHtml;
		if (bcSfFilterConfig.custom.thumbnail_hover_enabled){			
			var itemProductInfoHover = 	'<div class="quick-shop__info">'+
											'<div class="thumbnail-overlay">'+
												'<div class="info text-align-center">'+
													'{{itemProductInfo}}' +
												'</div>'+
											'</div>' +
										'</div>';
			html = html.replace(/{{itemProductInfoHover}}/g, itemProductInfoHover);
		} else {
			html = html.replace(/{{itemProductInfoHover}}/g, '');
			html = html.replace(/{{itemReviews}}/g, '');
		}
		if (!bcSfFilterConfig.custom.enable_quickshop){
			html = html.replace(/{{itemQuickShop}}/g, '');
		}
	}
	return html;
}

function buildPrice(data){
	var html = '';
	var onSale = data.compare_at_price_max > data.price_min;
	var soldOut = !data.available;
	var priceVaries = data.price_max != data.price_min;
	html += '<span class="product-thumbnail__price price '+ (onSale ? 'sale' : '') +'"> ';
	if (!soldOut){
		if (data.price_min > 0){
			if (priceVaries){
				html += '<small><em>' + bcSfFilterConfig.label.from + '</em></small> ';
			}
			html += '<span class="money">' + bcsffilter.formatMoney(data.price_min) + '</span> ';
		} else {
			html += bcSfFilterConfig.custom.free_price_text;
		}
		if (onSale){
			html += '<span class="product-thumbnail__was-price was-price">' +
            			'<span class="money">' + bcsffilter.formatMoney(data.compare_at_price_max) + '</span>' +
          			'</span>';
		}
	} else {
		html += '<span class="product-thumbnail__sold-out sold-out">' + bcSfFilterConfig.label.sold_out + '</span>'
	}

	return html;
}

function buildSwatch(data){
	var html = '';
	var values = [];
	var swatchItems = [];
	if (bcSfFilterConfig.custom.collection_swatches){
		data.variants.forEach(function(variant){
			var colorValue = '';
			var optionValue = '';
			variant.merged_options.forEach(function(option){
				var key = option.split(':')[0];
				var value = option.split(':')[1];
				if ((key.toLowerCase().indexOf('color') != -1 || key.toLowerCase().indexOf('colour') != -1) && values.indexOf(value.toLowerCase()) == -1){
					values.push(value.toLowerCase());
					colorValue = value;
					optionValue = key; 
				}
			});
			if (colorValue){	
				var swatchItem ='<a href="{{variantUrl}}" class="swatch swatch__style--{{swatchShape}}" data-swatch-name="meta-{{slugifyOptionValue}}_{{slugifyColorValue}}">' +
									'<span data-image="{{variantImage}}" style="background-color: {{colorBackground}};">' +
										'<img class="swatch__image" src="{{colorImage}}" onerror="this.className += \' swatch__image--empty\'">' +
				  					'</span>' +
			  					'</a>';
				
				swatchItem = swatchItem.replace(/{{swatchShape}}/g, bcSfFilterConfig.custom.collection_swatches_shape);
				swatchItem = swatchItem.replace(/{{colorBackground}}/g, bcsffilter.slugify(colorValue).split('-').pop());
				swatchItem = swatchItem.replace(/{{slugifyOptionValue}}/g, bcsffilter.slugify(optionValue).replace('-', '_'));
				swatchItem = swatchItem.replace(/{{slugifyColorValue}}/g, bcsffilter.slugify(colorValue).replace('-', '_'));
				swatchItem = swatchItem.replace(/{{variantUrl}}/g, bcsffilter.buildProductItemUrl(data) + '?variant=' + variant.id);

				var colorImage = bcSfFilterMainConfig.general.file_url.split('?')[0] + bcsffilter.slugify(colorValue) + '_50x.png';
				swatchItem = swatchItem.replace(/{{colorImage}}/g, colorImage);
				
				var variantImage = '';
				var noImageClass = '';
				if (variant.image){
					switch (bcSfFilterConfig.custom.products_per_row){
						case 2: variantImage = bcsffilter.optimizeImage(variant.image, '600x'); break;
						case 3: variantImage = bcsffilter.optimizeImage(variant.image, '500x'); break;
						default: variantImage = bcsffilter.optimizeImage(variant.image, '400x'); break;
					}
				}
				swatchItem = swatchItem.replace(/{{variantImage}}/g, variantImage);
				swatchItems.push(swatchItem);				  	  
			}
		})
	}
	if (swatchItems.length > 0){
		html = '<div class="thumbnail-swatch is-justify-'+ bcSfFilterConfig.custom.thumbnail_text_alignment +' is-flex-wrap">' + 
					swatchItems.join(' ') + 
				'</div>';
	}
	return html;
}

function bgset(image){
	var bgset = '';
	if (image) {
		var aspect_ratio = image.width / image.height;

		if (image.width > 180) bgset += ' ' + bcsffilter.optimizeImage(image.src, '180x') + ' 180w ' + Math.round(180 / aspect_ratio) + 'h,';
		if (image.width > 360) bgset += ' ' + bcsffilter.optimizeImage(image.src, '360x') + ' 360w ' + Math.round(360 / aspect_ratio) + 'h,';
		if (image.width > 540) bgset += ' ' + bcsffilter.optimizeImage(image.src, '540x') + ' 540w ' + Math.round(540 / aspect_ratio) + 'h,';
		if (image.width > 720) bgset += ' ' + bcsffilter.optimizeImage(image.src, '720x') + ' 720w ' + Math.round(720 / aspect_ratio) + 'h,';
		if (image.width > 900) bgset += ' ' + bcsffilter.optimizeImage(image.src, '900x') + ' 900w ' + Math.round(900 / aspect_ratio) + 'h,';
		if (image.width > 1080) bgset += ' ' + bcsffilter.optimizeImage(image.src, '1080x') + ' 1080w ' + Math.round(1080 / aspect_ratio) + 'h,';
		if (image.width > 1296) bgset += ' ' + bcsffilter.optimizeImage(image.src, '1296x') + ' 1296w ' + Math.round(1296 / aspect_ratio) + 'h,';
		if (image.width > 1512) bgset += ' ' + bcsffilter.optimizeImage(image.src, '1512x') + ' 1512w ' + Math.round(1512 / aspect_ratio) + 'h,';
		if (image.width > 1728) bgset += ' ' + bcsffilter.optimizeImage(image.src, '1728x') + ' 1728w ' + Math.round(1728 / aspect_ratio) + 'h,';
		if (image.width > 1950) bgset += ' ' + bcsffilter.optimizeImage(image.src, '1950x') + ' 1950w ' + Math.round(1950 / aspect_ratio) + 'h,';
		if (image.width > 2100) bgset += ' ' + bcsffilter.optimizeImage(image.src, '2100x') + ' 2100w ' + Math.round(2100 / aspect_ratio) + 'h,';
		if (image.width > 2260) bgset += ' ' + bcsffilter.optimizeImage(image.src, '2260x') + ' 2260w ' + Math.round(2260 / aspect_ratio) + 'h,';
		if (image.width > 2450) bgset += ' ' + bcsffilter.optimizeImage(image.src, '2450x') + ' 2450w ' + Math.round(2450 / aspect_ratio) + 'h,';
		if (image.width > 2700) bgset += ' ' + bcsffilter.optimizeImage(image.src, '2700x') + ' 2700w ' + Math.round(2700 / aspect_ratio) + 'h,';
		if (image.width > 3000) bgset += ' ' + bcsffilter.optimizeImage(image.src, '3000x') + ' 3000w ' + Math.round(3000 / aspect_ratio) + 'h,';
		if (image.width > 3350) bgset += ' ' + bcsffilter.optimizeImage(image.src, '3350x') + ' 3350w ' + Math.round(3350 / aspect_ratio) + 'h,';
		if (image.width > 3750) bgset += ' ' + bcsffilter.optimizeImage(image.src, '3750x') + ' 3750w ' + Math.round(3750 / aspect_ratio) + 'h,';
		if (image.width > 4100) bgset += ' ' + bcsffilter.optimizeImage(image.src, '4100x') + ' 180w ' + Math.round(4100 / aspect_ratio) + 'h,';
		bgset += ' ' + image.src + ' ' + image.width + 'w ' + image.height + 'h,';
	}
	return bgset;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function (totalProduct) {
	// Get page info
	var currentPage = parseInt(this.queryParams.page);
	var totalPage = Math.ceil(totalProduct / this.queryParams.limit);
	// If it has only one page, clear Pagination
	if (totalPage == 1) {
		jQ(this.selector.pagination).html('');
		return false;
	}
	if (this.getSettingValue('general.paginationType') == 'default') {
		var paginationHtml = bcSfFilterTemplate.paginateHtml;
		// Build Previous
		var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : '';
		previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
		paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);
		// Build Next
		var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : '';
		nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
		paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);
		// Create page items array
		var beforeCurrentPageArr = [];
		for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
			beforeCurrentPageArr.unshift(iBefore);
		}
		if (currentPage - 4 > 0) {
			beforeCurrentPageArr.unshift('...');
		}
		if (currentPage - 4 >= 0) {
			beforeCurrentPageArr.unshift(1);
		}
		beforeCurrentPageArr.push(currentPage);
		var afterCurrentPageArr = [];
		for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
			afterCurrentPageArr.push(iAfter);
		}
		if (currentPage + 3 < totalPage) {
			afterCurrentPageArr.push('...');
		}
		if (currentPage + 3 <= totalPage) {
			afterCurrentPageArr.push(totalPage);
		}
		// Build page items
		var pageItemsHtml = '';
		var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
		for (var iPage = 0; iPage < pageArr.length; iPage++) {
			if (pageArr[iPage] == '...') {
				pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
			} else {
				pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
			}
			pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
			pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
		}
		paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);
		jQ(this.selector.pagination).html(paginationHtml);
	}
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function () {
	if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
		jQ(this.selector.topSorting).html('');

		var sortingArr = this.getSortingList();
		if (sortingArr) {
			// Build content
			var sortingItemsHtml = '';
			for (var k in sortingArr) {
				sortingItemsHtml += '<option value="' + k + '">' + sortingArr[k] + '</option>';
			}
			var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
			jQ(this.selector.topSorting).html(html);

			// Set current value
			jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
		}
	}
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
	if (bcSfFilterConfig.custom.enable_quickshop){
		var count = 0;
		data.forEach(function(product){
			var url = bcsffilter.buildProductItemUrl(product, true);
			jQ.ajax({
				type: "GET",
				url: url + '?view=bc-sf-quickview',
				success: function (result) {					
					if (jQ('[data-bc-sf-quickshop-id="'+ product.id + '"]').length == 1){
						jQ('[data-bc-sf-quickshop-id="'+ product.id + '"]').replaceWith(result);											
					}
					count++;
					if (count == data.length){
						buildTheme();
					}
				}
			});
		})
	} else {
		buildTheme();
	}
};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {};

function buildTheme(){
	if (window.SPR) {
		SPR.initDomEls();
		SPR.loadBadges();
	}
	Shopify.PaymentButton.init();

	if (bcSfFilterConfig.custom.show_multiple_currencies) {
    	convertCurrencies();
	}
}

// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};

function customizeJsonProductData(data) {for (var i = 0; i < data.variants.length; i++) {var variant = data.variants[i];var featureImage = data.images.filter(function(e) {return e.src == variant.image;});if (featureImage.length > 0) {variant.featured_image = {"id": featureImage[0]['id'],"product_id": data.id,"position": featureImage[0]['position'],"created_at": "","updated_at": "","alt": null,"width": featureImage[0]['width'], "height": featureImage[0]['height'], "src": featureImage[0]['src'], "variant_ids": [variant.id]}} else {variant.featured_image = '';};};var self = bcsffilter;var itemJson = {"id": data.id,"title": data.title,"handle": data.handle,"vendor": data.vendor,"variants": data.variants,"url": self.buildProductItemUrl(data),"options_with_values": data.options_with_values,"images": data.images,"images_info": data.images_info,"available": data.available,"price_min": data.price_min,"price_max": data.price_max,"compare_at_price_min": data.compare_at_price_min,"compare_at_price_max": data.compare_at_price_max};return itemJson;};
BCSfFilter.prototype.prepareProductData = function(data) {var countData = data.length;for (var k = 0; k < countData; k++) {data[k]['images'] = data[k]['images_info'];if (data[k]['images'].length > 0) {data[k]['featured_image'] = data[k]['images'][0]} else {data[k]['featured_image'] = {src: bcSfFilterConfig.general.no_image_url,width: '',height: '',aspect_ratio: 0}}data[k]['url'] = '/products/' + data[k].handle;var optionsArr = [];var countOptionsWithValues = data[k]['options_with_values'].length;for (var i = 0; i < countOptionsWithValues; i++) {optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options'] = optionsArr;if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) {var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim();function updateMultiCurrencyPrice(oldPrice, newPrice) {if (typeof newPrice != 'undefined') {return newPrice;}return oldPrice;}data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]);data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]);data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]);data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]);}data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100;data[k]['price'] = data[k]['price_min'];data[k]['compare_at_price'] = data[k]['compare_at_price_min'];data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max'];var firstVariant = data[k]['variants'][0];if (getParam('variant') !== null && getParam('variant') != '') {var paramVariant = data[k]['variants'].filter(function(e) {return e.id == getParam('variant')});if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0]} else {var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {if (data[k]['variants'][i].available) {firstVariant = data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant'] = firstVariant;var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {var variantOptionArr = [];var count = 1;var variant = data[k]['variants'][i];var variantOptions = variant['merged_options'];if (Array.isArray(variantOptions)) {var countVariantOptions = variantOptions.length;for (var j = 0; j < countVariantOptions; j++) {var temp = variantOptions[j].split(':');data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];data[k]['variants'][i]['option_' + temp[0]] = temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options'] = variantOptionArr}data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100}data[k]['description'] = data[k]['content'] = data[k]['body_html'];if (data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0) {data[k]['tags'] = data[k]['original_tags'].slice(0);}data[k]['json'] = customizeJsonProductData(data[k]);}return data;};

// Fix image url issue of swatch option
function getFilePath(fileName, ext, version) {
    var self = bcsffilter;
    var ext = typeof ext !== 'undefined' ? ext : 'png';
    var version = typeof version !== 'undefined' ? version : '1';
    var prIndex = self.fileUrl.lastIndexOf('?');
    if (prIndex > 0) {
        var filePath = self.fileUrl.substring(0, prIndex);
    } else {
        var filePath = self.fileUrl;
    }
    filePath += fileName + '.' + ext + '?v=' + version;
    return filePath;
}

BCSfFilter.prototype.getFilterData=function(eventType,errorCount){function BCSend(eventType,errorCount){var self=bcsffilter;var errorCount=typeof errorCount!=="undefined"?errorCount:0;self.showLoading();if(typeof self.buildPlaceholderProductList=="function"){self.buildPlaceholderProductList(eventType)}self.beforeGetFilterData(eventType);self.prepareRequestParams(eventType);self.queryParams["callback"]="BCSfFilterCallback";self.queryParams["event_type"]=eventType;var url=self.isSearchPage()?self.getApiUrl("search"):self.getApiUrl("filter");var script=document.createElement("script");script.type="text/javascript";var timestamp=(new Date).getTime();script.src=url+"?t="+timestamp+"&"+jQ.param(self.queryParams);script.id="bc-sf-filter-script";script.async=true;var resendAPITimer,resendAPIDuration;resendAPIDuration=2e3;script.addEventListener("error",function(e){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}if(errorCount<3){errorCount++;if(resendAPITimer){clearTimeout(resendAPITimer)}resendAPITimer=setTimeout(self.getFilterData("resend",errorCount),resendAPIDuration)}else{self.buildDefaultElements(eventType)}});document.getElementsByTagName("head")[0].appendChild(script);script.onload=function(){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}}}this.requestFilter(BCSend,eventType,errorCount)};BCSfFilter.prototype.requestFilter=function(sendFunc,eventType,errorCount){sendFunc(eventType,errorCount)};




/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
