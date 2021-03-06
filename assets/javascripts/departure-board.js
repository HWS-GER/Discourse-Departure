var FlapBuffer = function(wrap, num_lines) {
    this.wrap = wrap;
    this.num_lines = num_lines;
    this.line_buffer = '';
    this.buffers = [[]];
    this.cursor = 0;
};

FlapBuffer.prototype = {

    pushLine: function(line) {

        if (this.buffers[this.cursor].length < this.num_lines) {
           this.buffers[this.cursor].push(line);
        } else {
            this.buffers.push([]);
            this.cursor++;
            this.pushLine(line);
        } 
    },

    pushWord: function(word) {
        if (this.line_buffer.length == 0) {
            this.line_buffer = word;
        } else if ((word.length + this.line_buffer.length + 1) <= this.wrap) {
            this.line_buffer += ' ' + word;
        } else {
            this.pushLine(this.line_buffer);
            this.line_buffer = word;
        }
    },

    flush: function() {
        if (this.line_buffer.length) {
            this.pushLine(this.line_buffer);
            this.line_buffer = '';
        }
    },

};

var FlapDemo = function(display_selector) {
    var _this = this;

    var onAnimStart = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').addClass('active');
    };

    var onAnimEnd = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').removeClass('active');
    };

    this.opts = {
        chars_preset: 'alphanum',
        align: 'left',
        width: 40,
        on_anim_start: onAnimStart,
        on_anim_end: onAnimEnd
    };

    this.timers = [];

    this.$displays = $(display_selector);
    this.num_lines = this.$displays.length;

    this.line_delay = 300;
    this.screen_delay = 7000;

    this.$displays.flapper(this.opts);

    $(click_selector).click(function(e){
        var text = _this.cleanInput(_this.$displays.text());

        var buffers = _this.parseInput(text);

        _this.stopDisplay();
        _this.updateDisplay(buffers);

        e.preventDefault();
    });
};

FlapDemo.prototype = {

    cleanInput: function(text) {
        return text.trim().toUpperCase();
    },

    parseInput: function(text) {
        var buffer = new FlapBuffer(this.opts.width, this.num_lines);
        var lines = text.split(/\n/);

        for (i in lines) {
            var words = lines[i].split(/\s/);
            for (j in words) {
                buffer.pushWord(words[j]);
            }
            buffer.flush();
        }

        buffer.flush();
        return buffer.buffers;
    },

    stopDisplay: function() {
        for (i in this.timers) {
            clearTimeout(this.timers[i]);
        }

        this.timers = [];
    },

    updateDisplay: function(buffers) {
        var _this = this;
        var timeout = 100;

        for (i in buffers) {

            _this.$displays.each(function(j) {

                var $display = $(_this.$displays[j]);

                (function(i,j) {
                    _this.timers.push(setTimeout(function(){
                        if (buffers[i][j]) {
                            $display.val(buffers[i][j]).change();
                        } else {
                            $display.val('').change();
                        }
                    }, timeout));
                } (i, j));

                timeout += _this.line_delay;
            });

            timeout += _this.screen_delay;
        }
    }

};

$(document).ready(function(){
  setTimeout(function(){
      var entry = 0;
      var lineln = 0;
      jQuery(".wrap").css("max-width","100%");

      jQuery("a.badge-wrapper.bar").each(function(){
        jQuery(this).addClass("XS");
        jQuery(this).parent().css("width","120px");
        var a = jQuery(this).attr("href");
        var url = "http://checkpointforarts.com"+a;
        var atag = "<a href='"+url+"' title='' />";
        jQuery(this).wrapAll(atag);
        jQuery(this).flapper({width:8,align:'left'}).change();
    });
	
    jQuery("a.title").each(function(){
        
        jQuery(this).parent().css("width","530px");
       
     
        jQuery(this).flapper({width:36,align:'left'}).change();
		   
    });
    jQuery("td.num.views").each(function(){
        /**jQuery(this).addClass("XS").css("width","35px");
        var count = jQuery(this).text().length;
        jQuery(this).flapper({width:3,align:'left'}).change();*/
		$(this).remove();
    });
    jQuery(".posts-map.badge-posts.heatmap-").each(function(){
       
        var count = jQuery(this).text().length;
        jQuery(this).flapper({width:4,align:'left'}).change();
		
    });
      jQuery(".last-post>.poster-info").each(function(){
        jQuery(this).addClass("XS");
          jQuery(".flapper.poster-info.XS").css("width","110px");
          
          var a = jQuery('.last-post>.poster-info > a').attr("href");
          var url = "http://checkpointforarts.com"+a;
          var atag = "<a href='"+url+"' title='' />";
          $("td.last-post div.poster-info:nth-child(2)").wrapAll(atag);
        jQuery(this).flapper({width:7,align:'left'}).change();

    });
    jQuery(".editor").parent().each(function(){
       
       var a = jQuery('this').children('a').attr("href");
        var url = "http://checkpointforarts.com"+a;
        var atag = "<a href='"+url+"' title='' />";
        jQuery(this).children('div').wrapAll(atag);
        jQuery(this).children().flapper({width:10,align:'left'}).change();
    });
	
	 jQuery("a.title").each(function(){
				 var a = jQuery(this).attr("href");
				var url = "http://checkpointforarts.com"+a;
				var atag = "<a href='"+url+"' title='' />";
		 
			jQuery(this).parent().children("div").wrapAll(atag);
			
			
	 });
	 jQuery("div.title").addClass("XS").css("width","530px");
	  jQuery(".editor").next("div").addClass("XS").css("width","200px");
	   jQuery("div.posts-map.badge-posts.heatmap-").addClass("XS reply").css("width","60px");
}, 850);
});

function flapperize(element){
  new FlapDemo('.topic-list .main-link a.title');
}