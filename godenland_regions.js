var _godenland_regions = [
{"id": 19 , "name_msgid": 5341, "name": "Altenbrog"},
{"id": 33 , "name_msgid": 5355, "name": "Amathemgir"},
{"id": 41 , "name_msgid": 5363, "name": "Bathai-azgyr"},
{"id": 20 , "name_msgid": 5342, "name": "Bergshaft"},
{"id": 45 , "name_msgid": 5367, "name": "Cet-dan"},
{"id": 35 , "name_msgid": 5357, "name": "Frosnenjord"},
{"id": 22 , "name_msgid": 5344, "name": "Goddenjord"},
{"id": 26 , "name_msgid": 5348, "name": "Greusmergen"},
{"id": 31 , "name_msgid": 5353, "name": "Haaz-koohrai"},
{"id": 18 , "name_msgid": 5340, "name": "Holengen"},
{"id": 21 , "name_msgid": 5343, "name": "Islandlend"},
{"id": 17 , "name_msgid": 5339, "name": "Jarlslig"},
{"id": 36 , "name_msgid": 5358, "name": "Jodensbrug"},
{"id": 40 , "name_msgid": 5362, "name": "Kharai-glod"},
{"id": 29 , "name_msgid": 5351, "name": "Khatchakten"},
{"id": 16 , "name_msgid": 5338, "name": "Kjostenbrud"},
{"id": 24 , "name_msgid": 5346, "name": "Klausenland"},
{"id": 32 , "name_msgid": 5354, "name": "Kron-Insel"},
{"id": 46 , "name_msgid": 5368, "name": "Langerzehrt berg"},
{"id": 15 , "name_msgid": 5337, "name": "Oyensrog"},
{"id": 27 , "name_msgid": 5349, "name": "Phat-Tsarai"},
{"id": 28 , "name_msgid": 5350, "name": "Roysbad"},
{"id": 23 , "name_msgid": 5345, "name": "Schneeglom"},
{"id": 30 , "name_msgid": 5352, "name": "Schwarzenweg"},
{"id": 39 , "name_msgid": 5361, "name": "Shin-Shin cakmet"},
{"id": 38 , "name_msgid": 5360, "name": "Smalbucht"},
{"id": 25 , "name_msgid": 5347, "name": "Snoenfeld"},
{"id": 43 , "name_msgid": 5365, "name": "Tashmyr-chak"},
{"id": 34 , "name_msgid": 5356, "name": "Tsahrim-then"},
{"id": 37 , "name_msgid": 5359, "name": "Uffer-de-Furst"},
{"id": 42 , "name_msgid": 5364, "name": "Urzunai"},
{"id": 44 , "name_msgid": 5366, "name": "Zelzerdorn"}];

var _getRegionByKeyMatch = function(k,v) {
  for (var i=0;i<_godenland_regions.length;++i) {
    if (_godenland_regions[i][k] == v)
      return _godenland_regions[i];
  }
}
 
var _getRegionById        = function(v) { return _getRegionByKeyMatch("id"        , v); };
var _getRegionByNameMsgId = function(v) { return _getRegionByKeyMatch("name_msgid", v); };
var _getRegionByName      = function(v) { return _getRegionByKeyMatch("name"      , v); };
