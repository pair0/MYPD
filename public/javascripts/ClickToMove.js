const menu_about = document.querySelector("#menu_about");
const menu_contact = document.querySelector("#menu_contact");
const about = document.querySelector("#scroll_about").offsetTop;
const contact = document.querySelector("#scroll_contact").offsetTop;

menu_about.onclick = function(){
    window.scrollTo({top:about-100, behavior:'smooth'});  
}
menu_contact.onclick = function(){
    window.scrollTo({top:contact+50, behavior:'smooth'});  
}



$('.input_size_con').keyup(function(){
    var content = $(this).val();
    $('.count span').html(content.length);
    if (content.length > 1000){
      alert("최대 1000자까지 입력 가능합니다.");
      $(this).val(content.substring(0, 1000));
      $('.text_box .count span').html(1000);
    }
  });

