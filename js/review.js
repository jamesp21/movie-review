// Initialize Parse app

Parse.initialize('lvPavTC2S0QXUTwfNu8wJHjbChu0IdD8DSOieyzc', 'vBbW5rGcD87KA4NO6qMxg2TfNiQdfkD8v7FIKqYl');
// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');
var totalRatings = 0;
var totalReviews = 0;
var averageRatings = 0;
//allows stars to be shown in the "ratings part"
$('#ratings').raty({ path: 'raty-2.7.0/lib/images'});

// Click event when form is submitted
$('form').submit(function() {
	$('#average-ratings').raty({ path: 'raty-2.7.0/lib/images', score: averageRatings});
	// Create a new instance of your Review class 
	var review = new Review();
	// For each input element, set a property of your new instance equal to the input's value
	//Set a property 'title' equal to a title of review name
	review.set('title', $(title).val());
	//Set a property 'description' equal to the description
	review.set('description', $(description).val());
	// Set a property 'rating' equal to a rating
	review.set('ratings', $('#ratings').raty('score'));
	review.set('up', 0);
	review.set('down', 0);
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
	// Get parameters (website, band, song) from the data item passed to the function
	totalReviews++;
	var title = item.get('title');
	var description = item.get('description');
	var ratings =item.get('ratings');
		totalRatings += ratings;
		averageRatings = totalRatings / totalReviews;
	// Append li that includes text from the data item
	var li = $('<div class="sections"><p>' + title + '<br>'  + description + '<br><p></div>');
	var stars = $('<span id="stars">').raty({ path: 'raty-2.7.0/lib/images', readOnly: true, score: ratings});
	var upVote = $('<span class="up-vote"> </span>');
	var downVote = $('<span class="down-vote"> </span>');
	var button = $('<button class ="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	button.click(function(){
		item.destroy({
			success:getData
		})
	})
	li.prepend(stars);
	li.prepend(upVote);
	li.prepend(downVote);
	li.append(button);
	$('ol').append(li)
	$('.up-vote').click(function () {
		item.increment('up');
		item.save(null, {
			success:getData
		})
	})
	$('.down-vote').click(function () {
		item.increment('down');
		item.save(null, {
			success:getData
		})
	})
	if (item.get('down') + item.get('up') != 0) {
		var total = item.get('up') + item.get('down');
		var helpful = "";
		if (total == 1){
			helpful += "1 person found this review helpful";
		}else {
		helpful += item.get('up') + " out of " + total + " people found this review helpful";
		}
		li.append(helpful);
	}
	// Time pending, create a button that removes the data item on click
	$('#average-ratings').raty({ path: 'raty-2.7.0/lib/images', readOnly: true, score: averageRatings});
}
// Call your getData function when the page loads
getData();