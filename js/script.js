
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
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";

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


global.$dc = dc; 

})(window);


