// Initialize Parse app

Parse.initialize('lvPavTC2S0QXUTwfNu8wJHjbChu0IdD8DSOieyzc', 'vBbW5rGcD87KA4NO6qMxg2TfNiQdfkD8v7FIKqYl');
// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');
var totalRatings = 0;
//allows stars to be shown in the "ratings part"
$('#ratings').raty({ path: 'raty-2.7.0/lib/images' });

// Click event when form is submitted
$('form').submit(function() {
	// Create a new instance of your Review class 
	var review = new Review();
	// For each input element, set a property of your new instance equal to the input's value
	//Set a property 'title' equal to a title of review name
	review.set('title', $(title).val());
	//Set a property 'description' equal to the description
	review.set('description', $(description).val());
	// Set a property 'rating' equal to a rating
	totalRatings = totalRatings + $('#ratings').raty('score');
	review.set('ratings', $('#ratings').raty('score'));
	//alert($('#rating').raty('score'));
	$(title).val(" ");
	$(description).val(" ");
	// Save your instance of your review -- and go see it on parse.com!
	review.save(null, {
		success:getData
	});
	$(title).placeholder();
	$(description).placeholder();
	// After setting each property, save your new instance back to your database
	return false;
})

// Write a function to get data
var getData = function() {
	// Set up a new query for our Review class
	var query = new Parse.Query(Review);
	// Set a parameter for your query -- where the description property isn't missing
	//query.exists('website'); or
	query.notEqualTo('description', ' ');

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:buildList
	})
}

// A function to build your list
var buildList = function(data) {
	// Empty out your unordered list
	$('ol').empty()
	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d){
		addItem(d);
	})
}

// This function takes in an item, adds it to the screen
var addItem = function(item) {
	//console.log('addItem', item)
	// Get parameters (website, band, song) from the data item passed to the function
	var title = item.get('title');
	var description = item.get('description');
	var ratings =item.get('ratings');
	// Append li that includes text from the data item
	var li = $('<p>' + title + '</p>' + '<p>' + description + '</p>' + '<p>' + ratings + '</p>')
	var button = $('<button class ="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	button.click(function(){
		item.destroy({
			success:getData
		})
	})
	li.append(button);
	$('ol').append(li)
	// Time pending, create a button that removes the data item on click
}
// Call your getData function when the page loads
//console.log(totalRatings);
getData();