Meteor.startup(function(){

    var selection_home;
    var selection_nav;

    $('.home-wrapper ul li').click(function(){
        $('.box').addClass('box-hide');
        selection_home = this.id;
        $('.'+selection_home+'').removeClass('box-hide');
    });

    $('.home-access').click(function(){
        $('.box').addClass('box-hide');
        selection_home = "box-home";
        $('.'+selection_home+'').removeClass('box-hide');
    });

    $('.modal-nav-btn').click(function(){
        $('.modal-nav-box').addClass('box-hide');
        if(this.id != selection_nav){
            selection_nav = this.id;
            $('.'+selection_nav+'').removeClass('box-hide'); 
        }else{
            selection_nav = "";
        }
       
    });

    $('.close').click(function(){
        $('.modal-nav-box').addClass('box-hide');
        selection_nav = "";
    });

});