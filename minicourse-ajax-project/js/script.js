
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var IMGT = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=%data%">';
    var imgStr = IMGT.replace('%data%', address);

    // var apiKey = '02e7f8b72b744aa1a4623d979c8d1290';
    var apiKey = '090';
    var nytUrl = "https://api.nytimesxxx.com/svc/search/v2/articlesearch.json?" + $.param(
      {'api-key': apiKey,
          'sort': 'newest',
          'q': cityStr}
    );

    var ARTICLET = '<li class="article"><a href="%articleUrl%">%hData%</a><p>%pData%</p></li>';
    var articleStr = '';

    // clear out old data before new request
    // $wikiElem.text("");
    // $nytElem.text("");

    // load streetview
    $greeting.text('So, you want to live at ' + address + '?');
    $body.append(imgStr);

    // YOUR CODE GOES HERE!
    $.getJSON(nytUrl, function(data) {
      $nytElem.text('New York Times Articles about ' + cityStr);
      var articles = data.response.docs;
      articles.forEach(function(article) {
        console.log(article);

        console.log(article.web_url + '\n');
        console.log(article.headline.main + '\n');
        console.log(article.snippet + '\n');

        articleStr = ARTICLET.
            replace('%articleUrl%', article.web_url).
            replace('%hData%', article.headline.main).
            replace('%pData%', article.snippet);
        $nytElem.append(articleStr);
      })
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      $nytHeaderElem.text('New York Times Articles could not be loaded');
      console.log("error: " + textStatus);
      console.log("incoming Text: " + jqXHR.responseText);
    });

    return false;
};

$('#form-container').submit(loadData);
