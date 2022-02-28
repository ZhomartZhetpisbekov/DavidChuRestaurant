
document.addEventListener("DOMContentLoaded", 
	function () {
		const menuToggle = document.
			getElementById('navbarSupportedContent')
		const bsCollapse = 
			new bootstrap.Collapse(menuToggle, {toggle:false})

		document.querySelector('#navbarToggle')
		.addEventListener('blur', () => { bsCollapse.toggle() })

});


(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "https://www.davidchuschinabistro.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";

var menuItemsUrl = "https://www.davidchuschinabistro.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var aboutHtml = "snippets/about-snippet.html";

var awardsHtml = "snippets/awards-snippet.html";

// Convinience method for inserting innerHTML for 'select'
var insertHTML = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
};

// Show loading content inside element identified by 'selector'
var showLoading = function (selector) {
	var html = "<div class='text-center'>";
	html += "<img src='images/loading-icon.gif'></div>";
	insertHTML(selector, html);
};

// Return substitute of {{propName}}
// with propValue in the given 'string'
var insertProperty = function (string, propName, propValue) {
	var propToReplace = "{{" + propName + "}}";
	string = string
		.replace(new RegExp(propToReplace, 'g'), propValue);
	return string;
};




document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");

$ajaxUtils.sendGetRequest(
	homeHtml,
	function (responseText) {
		document.querySelector("#main-content")
			.innerHTML = responseText;
	},
	false);
});

dc.loadHomeTile = function () {
	// On first load, show home view
	showLoading("#main-content");

	$ajaxUtils.sendGetRequest(
		homeHtml,
		function (responseText) {
			document.querySelector("#main-content")
				.innerHTML = responseText;
		},
		false);
};

// Load menu categories view
dc.loadMenuCategories = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		allCategoriesUrl,
		buildAndShowCategoriesHtml);
};

// Load Menu Items view
dc.loadMenuItems = function (categoryShort) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		menuItemsUrl + categoryShort,
		buildAndShowMenuItemsHtml);
};

// Load About Page View
dc.loadAboutPage = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		aboutHtml,
		buildAndShowAboutHtml,
		false);
}

// Load Awards Page View
dc.loadAwardsPage = function() {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		awardsHtml,
		buildAndShowAwardsHtml,
		false);
};

// Builds HTML for the categories page based on
// the data from server
function buildAndShowCategoriesHtml (categories) {
	//Load title snippet of the categories page
	$ajaxUtils.sendGetRequest(
		categoriesTitleHtml,
		function (categoriesTitleHtml) {
			$ajaxUtils.sendGetRequest(
				categoryHtml,
				function (categoryHtml) {
					var categoriesViewHtml = 
						buildCategoriesViewHtml(categories,
																		categoriesTitleHtml,
																		categoryHtml);
					insertHTML("#main-content", categoriesViewHtml);
				},
				false);
		},
		false);
};

// Builds HTML for the Menu Item page based on
// the data from server
function buildAndShowMenuItemsHtml (menuItemsObject) {
	// Load title snippet of the Menu Page
	$ajaxUtils.sendGetRequest(
		menuItemsTitleHtml,
		function (menuItemsTitleHtml) {
			$ajaxUtils.sendGetRequest(
				menuItemHtml,
				function (menuItemHtml) {
					var menuItemsViewHtml = 
						buildMenuItemsViewHtml (menuItemsObject,
																		menuItemsTitleHtml,
																		menuItemHtml);
					insertHTML("#main-content", menuItemsViewHtml);
				},
				false);
		},
		false);
};

// Build About View Html
function buildAndShowAboutHtml (aboutHtml) {
	insertHTML("#main-content", aboutHtml);
};

// Build and Show Awards View Html
function buildAndShowAwardsHtml (awardsHtml) {
	insertHTML("#main-content", awardsHtml);
}


// Builds categories view HTML 
// using categories data and snippets html
function buildCategoriesViewHtml (categories,
																	categoriesTitleHtml,
																	categoryHtml) {
	var finalHtml = categoriesTitleHtml;
	finalHtml += "<section class='row'>";

	// Loop over categories
	for (var i = 0; i < categories.length; i++) {
		// Insert category values
		var html = categoryHtml;
		var name = "" + categories[i].name;
		var short_name = categories[i].short_name;

		html = insertProperty(html, "name", name);
		html = insertProperty(html, "short_name", short_name);
		finalHtml += html;

	}

	finalHtml += "</section>";
	return finalHtml;

};

// Builds Menu Items View Html
// using menu items data and snippets html
function buildMenuItemsViewHtml(menuItemsObject,
																menuItemsTitleHtml,
																menuItemHtml) {

	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
																			"name",
																			menuItemsObject.category.name);
	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
																			"special_instructions",
																			menuItemsObject.category.special_instructions);

	var finalHtml = menuItemsTitleHtml;
	finalHtml += "<section class='row'>";

	var catShortName = menuItemsObject.category.short_name;
	var menuItems = menuItemsObject.menu_items;

	// Loop over menu items 
	for (var i = 0; i < menuItems.length; i++) {
		var html = menuItemHtml;
		var short_name = menuItems[i].short_name;
		var name = "" + menuItems[i].name;
		var price_large = menuItems[i].price_large;
		var description = menuItems[i].description;

		html = insertProperty(html, "catShortName", catShortName);
		html = insertProperty(html, "short_name", short_name);
		html = insertProperty(html, "name", name);
		html = insertProperty(html, "price_large", price_large);
		html = insertProperty(html, "description", description);

		finalHtml += html;
	}

	finalHtml += "</section>";
	return finalHtml;

};


global.$dc = dc; 

})(window);


