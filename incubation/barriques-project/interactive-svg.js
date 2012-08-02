// global ---

function resetSize(svg, width, height) {
	svg.configure({
		width : width  || $(svg._container).width(),
		height: height || $(svg._container).height()
	});
};

function initializeInteractivity(svg, source) {
	var property;
	for(property in source) {
		if(source.hasOwnProperty(property)) {
			var parentId = property;
			initializeRelationships(svg, parentId, source[parentId]);
        }
	}
};

function showAll(svg, source) {
	forAll(svg, source, show);
};

function hideAll(svg, source) {
	forAll(svg, source, hide);
};

function forAll(svg, source, func) {
	var property;
	for(property in source) {
		if(source.hasOwnProperty(property)) {
			var parentId = property;
			var svgParent  = svg.getElementById(parentId);
			var relatedIds = source[parentId].related;
			relatedIds.forEach(function(relatedId) {
				func(svg, relatedId);
			});
        }
	}
};

function highlight(svg, elemId) {
	var svgElem  = svg.getElementById(elemId);
	if(typeof svgElem === "undefined" || svgElem===null) {
		console.log("> no element with id " + elemId);
		return;
	}
	svgElem.setAttribute('opacity', '0.5');
};

function unhighlight(svg, elemId) {
	var svgElem  = svg.getElementById(elemId);
	if(typeof svgElem === "undefined" || svgElem===null) {
		console.log("> no element with id " + elemId);
		return;
	}
	svgElem.setAttribute('opacity', '1.0');
};

function hide(svg, elemId) {
	var svgElem  = svg.getElementById(elemId);
	if(typeof svgElem === "undefined" || svgElem===null) {
		console.log("> no element with id " + elemId);
		return;
	}
	var forced = svgElem.getAttribute('display-forced');
	if(forced !== 'true')
		svgElem.setAttribute('display', 'none');
};

function show(svg, elemId) {
	var svgElem  = svg.getElementById(elemId);
	if(typeof svgElem === "undefined" || svgElem===null) {
		console.log("> no element with id " + elemId);
		return;
	}
	svgElem.setAttribute('display', 'block');
};

function toggle(svg, elemId) {
	var svgElem  = svg.getElementById(elemId);
	if(typeof svgElem === "undefined" || svgElem===null) {
		console.log("> no element with id " + elemId);
		return;
	}
	var visible = svgElem.getAttribute('display');
	if(visible==='block') {
		svgElem.setAttribute('display-forced', 'false');
		svgElem.setAttribute('display', 'none');
	}
	else {
		svgElem.setAttribute('display-forced', 'true');
		svgElem.setAttribute('display', 'block');
	}
};



function initializeRelationships(svg, parentId, parentData) {
	var svgParent  = svg.getElementById(parentId);
	var relatedIds = parentData.related;
	relatedIds.forEach(function(relatedId) {
		hide(svg, relatedId);
	});
	svgParent.onmouseover = function(e) {
		highlight(svg, parentId);
		relatedIds.forEach(function(relatedId) {
			show(svg, relatedId);
		});
	};
	svgParent.onmouseout = function(e) {
		unhighlight(svg, parentId);
		relatedIds.forEach(function(relatedId) {
			hide(svg, relatedId);
		});
	};
	svgParent.onclick = function(e) {
		relatedIds.forEach(function(relatedId) {
			toggle(svg, relatedId);
		});	
	};
};
