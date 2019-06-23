var header0 = document.getElementById("header0");
var _container = document.createElement("div");

_container.style.width = "98%";
_container.style.maxHeight = "400px";
_container.style.padding = "10px";
_container.style.background = "white";
_container.style.overflowY = "scroll";

var _currentTradePostId = -1;
var _urlParts = window.location.href.split(/\&/);
for (var i=0;i<_urlParts.length;++i) {
  var _tmp = _urlParts[i].split(/\=/);
  if (_tmp[0] == "tradePostId") {
    _currentTradePostId = _tmp[1];
  }
}

var _copperToHuman = function(_copper) {
  var _g = Math.floor(_copper / 10000);
  var _s = Math.floor((_copper % 10000) / 100);
  var _c = Math.floor((_copper % 10000) % 100);
  return _g +"g "+ _s +"s "+ _c +"c";
}

////////////////////////////////////////////////////////////////////////////////
// regional search
var _objectType = document.createElement("select");
_objectType.id = "_objectType";
for (var i=0;i<_object_types.length;++i) {
  var _option = document.createElement("option");
  _option.value = _object_types[i].id;
  _option.innerHTML = _object_types[i].name;
  _objectType.appendChild(_option);
}

var _region = document.createElement("select");
_region.id = "_region";
for (var i=0;i<_godenland_regions.length;++i) {
  var _option = document.createElement("option");
  _option.value = _godenland_regions[i].name_msgid;
  _option.innerHTML = _godenland_regions[i].name;
  _region.appendChild(_option);
}


var _regionalSearchResultSet = [];
var _regionalSearch = document.createElement("button");
_regionalSearch.innerHTML = "Search";
_regionalSearch.addEventListener("click", function() {
  _regionalSearchResultSet = [];
  document.getElementById("_regionalSearchResults").innerHTML = " ... loading ... ";
  var __objectType = document.getElementById('_objectType').value;
  var __region = document.getElementById('_region').value;
  
  var _resultHeaderFields = ["#", "Q", "Name", "Price/1", "Price/All", "Region", "TP", "Actions"];

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var _items = eval("("+ xhr.responseText +")");
      _items = _items.data;

      // add pricing information
      var _itemsWithPrices = [];
      for (var i=0;i<_items.length;++i) {
        // if the item is splittable, `CoinPrice` contains the price per item.
        // if the item is *NOT* splittable, `CoinPrice` contains the price for the whole lot/Quantity.
        var _item = _items[i];
        var _allowSplit = (_item.AllowSplitOnPurchase == "1");
        var _priceOne, _priceAll;
        if (_allowSplit) {
          _priceOne = _item.CoinPrice;
          _priceAll = _item.CoinPrice * _item.Quantity;          
        } else {
          _priceOne = _item.CoinPrice / _item.Quantity;
          _priceAll = _item.CoinPrice;
        }
        _item._allowSplit = _allowSplit;
        _item._priceOne = _priceOne;
        _item._priceAll = _priceAll;
        _itemsWithPrices.push(_item);
      }
      _items = _itemsWithPrices;

      // sort by price
      _items.sort(function(a, b) {
        _a = parseInt(a._priceOne);
        _b = parseInt(b._priceOne);
        if (_a == _b) return  0;
        if (_a < _b)  return -1;
        if (_a > _b)  return  1;
      });
      
      var _resultTable = document.createElement("table");
      var _resultHeader = document.createElement("tr");

      _resultTable.style.borderCollapse = "collapse";
      _resultTable.style.border = "1px solid gray";
      _resultHeader.style.border = "1px solid gray";
      
      for (var i=0;i<_resultHeaderFields.length;++i) {
        var _resultHeaderField = document.createElement("td");
        _resultHeaderField.style.border = "1px solid gray";
        _resultHeaderField.style.padding = "5px";
        _resultHeaderField.innerHTML = _resultHeaderFields[i];
        _resultHeader.appendChild(_resultHeaderField);
      }

      _resultTable.appendChild(_resultHeader);
      document.getElementById("_regionalSearchResults").innerHTML = "";

      for (var i=0;i<_items.length;++i) {
        var _item = _items[i];
        if (_item.RegionID != __region) continue;

        var _allowSplit = _item._allowSplit;
        var _priceOne = _item._priceOne;
        var _priceAll = _item._priceAll;

        var _regionalSearchResultSetIndex = _regionalSearchResultSet.length;
        _regionalSearchResultSet[_regionalSearchResultSetIndex] = _item;

        var _resultRow = document.createElement("tr");
        var _resultRowFields = [];
        _resultRow.style.border = "1px solid gray";

        _resultRowFields.push(_item.Quantity); 
        _resultRowFields.push(_item.Quality); 
        _resultRowFields.push(_item.Name); 
        _resultRowFields.push(_copperToHuman(_priceOne)); 
        _resultRowFields.push(_copperToHuman(_priceAll)); 
        _resultRowFields.push((_item.RegionID) ? (_getRegionByNameMsgId(_item.RegionID).name) : "-"); 
        _resultRowFields.push(_item.TradePostName);
        for (var j=0;j<_resultRowFields.length;++j) {
          var _resultRowField = document.createElement("td");
          _resultRowField.style.border = "1px solid gray";
          _resultRowField.style.padding = "5px";
          _resultRowField.innerHTML = _resultRowFields[j];
          _resultRow.appendChild(_resultRowField);
        }

        var _actionsField = document.createElement("td");
        _actionsField.style.padding = "5px";
 
        var _buyButton = document.createElement("button");
        _buyButton.id = _regionalSearchResultSetIndex +"_1";
        _buyButton.innerHTML = "Buy 1";
        if (! _allowSplit) {
          _buyButton.disabled = "true";
        }
        _buyButton.addEventListener("click", _doBuy);
        _actionsField.appendChild(_buyButton);

        var _buyAllButton = document.createElement("button");
        _buyAllButton.id = _regionalSearchResultSetIndex +"_"+ _item.Quantity;
        _buyAllButton.innerHTML = "Buy ALL";
        _buyAllButton.addEventListener("click", _doBuy);
        _actionsField.appendChild(_buyAllButton);
        _resultRow.appendChild(_actionsField);
        _resultTable.appendChild(_resultRow);
        _regionalSearchResultSetIndex++;
      }
      if (_regionalSearchResultSet.length < 1) {
        document.getElementById("_regionalSearchResults").innerHTML = "no results.";
      } else {
        document.getElementById("_regionalSearchResults").appendChild(_resultTable);
      }
    }
  };

  xhr.open("GET", "/market/market-api.php?list=itemOnSale&itemId="+ __objectType, true);
  xhr.send();
});

var _regionalSearchResults = document.createElement("div"); _regionalSearchResults.id = "_regionalSearchResults";
var _regionalBuyResults = document.createElement("div"); _regionalBuyResults.id = "_regionalBuyResults";

var _doBuy = function(e) {
  var _eventFrom = e.srcElement.id;
  var _parts = _eventFrom.split(/\_/);
  var _buyItem = _regionalSearchResultSet[_parts[0]];
  var _buyAmount = _parts[1];
  var _priceOne = (_buyItem.AllowSplitOnPurchase == "1") ? _buyItem.CoinPrice : _buyItem.CoinPrice / _buyItem.Quantity;
  
  if (! confirm("Buy "+ _buyAmount +" \""+ _buyItem.Name +"\" Quality "+ _buyItem.Quality +" for "+ _copperToHuman(_priceOne * _buyAmount) +"?")) return;

  var _sellUrl = "/market/market-api.php?action=purchaseTradeLot&lotId="+ _buyItem.LotID +"&itemQuantity="+ _buyAmount +
                  "&selectedTradePostId="+ _currentTradePostId +"&deliveryTradePostId="+ _currentTradePostId +"&estimatedPrice="+ ( _priceOne * _buyAmount );
  document.getElementById('_regionalBuyResults').innerHTML = "... buying ...";

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      document.getElementById('_regionalBuyResults').innerHTML = "... bought. please refresh for now! ...";
    }
  }

  xhr.open("GET", _sellUrl, true);
  xhr.send();
};

////////////////////////////////////////////////////////////////////////////////
// "UI"
if (_currentTradePostId == -1) {
  _container.innerHTML += "cannot find tradePostId.";
} else {
  _h = document.createElement("h3"); _h.innerHTML="Search for Regional Items"; _container.appendChild(_h);
  _container.appendChild(_objectType);
  _container.appendChild(_region);
  _container.appendChild(_regionalSearch);
  _container.appendChild(_regionalSearchResults);
  _container.appendChild(_regionalBuyResults);
  _container.appendChild(document.createElement("hr"));
}

header0.appendChild(_container);
