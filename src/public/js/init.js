(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.modal').modal();

  }); // end of document ready
})(jQuery); // end of jQuery name space
//Toaster
const toastHTML = document.querySelector('.toast').innerHTML;
const className = document.querySelector(".toast").classList.item(1)
M.toast({
  html: toastHTML, classes: className
});
