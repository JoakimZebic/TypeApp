$(document).ready(function(){
    //REMOVING PRELOADER
    setTimeout(function(){$('#preloader').fadeOut()},1000);

    // Activating LogIn/Register screen
    var LogClicked=false;
    $('.users').click(function(){
        if(!LogClicked){
            $('#smth').css('display','none');
            $('#type').removeClass('noLink').addClass('up');
            $(this).css('display','none');
            LogClicked=true;
            setTimeout(function(){$('#loggingIn').removeClass('hidden').addClass('showForm');},500)
            setTimeout(function(){$('#switch').addClass('showSwitch');},1200);
        }
    })

    // Navigation slide animation
    var menuActive = false;
    $('#menu').click(function(){
        if(!menuActive){
            $(this).addClass('active');
            $('#navigation').addClass('showNav');
            menuActive = true;
        }
        else{
            $(this).removeClass('active');
            $('#navigation').removeClass('showNav');
            menuActive = false;
        }
    })

    //Switching between LogIn and Register
    var switched = false;
    $('#switch').click(function(){
        if(!switched){
            $(this).removeClass('fa-user-plus').addClass('fa-user');
            $('#loggingIn').removeClass().addClass('hideForm');
            setTimeout(function(){$('#registering').removeClass().addClass('showForm');},800);
            switched = true;
        }
        else{
            $(this).removeClass('fa-user').addClass('fa-user-plus');
            $('#registering').removeClass().addClass('hideForm');
            setTimeout(function(){$('#loggingIn').removeClass().addClass('showForm');},800);
            switched = false;
        }
    })

    /******** LOGIN VALIDATE *********/

    //Button click validation
    $('#login').click(function(){
        validateLogIn();
    })

    function validateLogIn(){
        if(checkUsername($('#userLog')) && checkPass($('#passLog')))
            $.ajax({
                url: 'pages/login.php',
                method: 'POST',
                data: {
                    user: $('#userLog').val(),
                    pass: $('#passLog').val()
                },
                datatype: 'json',
                success: function(data){
                    if(data.error)
                        if(data.error.code == 1){
                            $('#userLog').addClass('bad');
                            $('#passLog').addClass('bad').next().removeClass('hidden').html(data.error.msg);
                        }
                    if(data.good)
                        location.reload(true);
                },
                error: function(xhr, status,error){
                    console.log(status);
                    console.log(error);
                }
        });    
    };

    //Blur validations
    $('#userLog').blur(function(){
        checkUsername($(this))
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad').next().addClass('hidden');
        }
    });

    $('#passLog').blur(function(){
        checkPass($(this))
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad').next().addClass('hidden');
        }
    });

    $('#passLog').keyup(function(e){
        if(e.keyCode===13)
            $('#login').click();
    });

    /******** REGISTER VALIDATE **********/

    //Button click validation
    $('#register').click(function(){
        validateRegister();
    })

    function validateRegister(){
        if(checkUsername($('#userReg')) && checkPass($('#passReg')) && checkEmail())
           $.ajax({
                url: 'pages/register.php',
                method: 'POST',
                data: {
                    user: $('#userReg').val(),
                    pass: $('#passReg').val(),
                    mail: $('#emailReg').val()
                },
                datatype: 'json',
                success: function(data){
                    if(data.user)
                        if(data.user.code == 1)
                            $('#userReg').addClass('bad').next().removeClass('hidden').html(data.user.msg);
                    if(data.pass)
                        if(data.pass.code == 1)
                            $('#passReg').addClass('bad').next().removeClass('hidden').html(data.pass.msg);
                    if(data.mail)
                        if(data.mail.code == 1)
                            $('#emailReg').addClass('bad').next().removeClass('hidden').html(data.mail.msg);
                   //If register is successfull -> LogIn
                    if(data.good){
                       $('#userLog').val($('#userReg').val());
                       $('#passLog').val($('#passReg').val());
                       $('#login').click();
                   }
                },
                error: function(xhr, status,error){
                    console.log(status);
                    console.log(error);
                }
           });  
    };

    //Blur validations
    $('#userReg').blur(function(){
        checkUsername($(this));
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad').next().addClass('hidden');
        }
    });

    $('#passReg').blur(function(){
        checkPass($(this));
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad').next().addClass('hidden');
        }
    });

    $('#emailReg').blur(function(){
        checkEmail();
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad').next().addClass('hidden');
        }
    });

    $('#emailReg').keyup(function(e){
        if(e.keyCode===13)
            $('#register').click();
    });

    /****************************** UPDATE USER *********************************/

    $('#uppU').click(function(){
        validateUpdate();
    })

    function validateUpdate(){
        var info = {};

        $userRe = /^[A-z][a-z]{2}[\da-z]{0,7}$/;
        $passRe = /[\w\d\W\D\s]{5,}/;
        $mailRe = /^[A-z\d]{2,}(\.?(\W\D)?[A-z\d]{2,})*\@\w{2,}(\.\w{2,})*$/;

        if(!$userRe.test($('#nameUp').val()) && $('#nameUp').val().trim()!=''){
            $('#nameUp').addClass('bad');
            $('#errU').html('Wrong format for Username');
        }
        else{
            $('#nameUp').removeClass('bad');
            $('#errU').html('');
            info.name = $('#nameUp').val();
        }

        if(!$mailRe.test($('#emailUp').val()) && $('#emailUp').val().trim()!=''){
            $('#emailUp').addClass('bad');
            $('#errM').html('Wrong format for E-Mail');
        }
        else{
            $('#emailUp').removeClass('bad');
            $('#errM').html('');
            info.mail = $('#emailUp').val();
        }

        if(!$passRe.test($('#passUpNew').val()) && $('#passUpNew').val().trim()!=''){
            $('#passUpNew').addClass('bad');
            $('#errPN').html('Wrong format for Password (NEW)');
        }
        else{
            $('#passUpNew').removeClass('bad');
            $('#errPN').html('');
            info.npass = $('#passUpNew').val();
        }

        if(!$passRe.test($('#passUpOld').val())){
            $('#passUpOld').addClass('bad');
            $('#errPO').html('Wrong format for Password (OLD)');
        }
        else{
            $('#passUpOld').removeClass('bad');
            $('#errPO').html('');
            info.opass = $('#passUpOld').val();
        }

        if(Object.keys(info).length > 1 && info.hasOwnProperty('opass')){
            $.ajax({
                url: 'pages/userUpdate.php',
                method: 'post',
                data: {
                    vals : info
                },
                datatype: 'json',
                success: function(data){
                    if(data.badPass){
                        $('#passUpOld').addClass('bad');
                        $('#errPO').html(data.badPass);
                    }
                    if(data.badUser){
                        $('#nameUp').addClass('bad');
                        $('#errU').html(data.badUser);
                    }
                    if(data.badMail){
                        $('#emailUp').addClass('bad');
                        $('#errM').html(data.badMail);
                    }
                    if(data.succ){
                        $('.logout').click();
                    }
                },
                error: function(xhr, status, error){
                    console.log(error);
                }
            })
        }
           
    };

    //Blur validations
    $('#nameUp').blur(function(){
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad');
            $('#errU').html('');
        }
        else{
            $userRe = /^[A-z][a-z]{2}[\da-z]{0,7}$/;

            if(!$userRe.test($(this).val())){
                $(this).addClass('bad');
                $('#errU').html('Wrong format for Username');
            }
            else{
                $(this).removeClass('bad');
                $('#errU').html('');
            }
        }
    });

    $('#passUpNew').blur(function(){
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad');
            $('#errPN').html('');
        }
        else{
            $passRe = /[\w\d\W\D\s]{5,}/;

            if(!$passRe.test($(this).val())){
                $(this).addClass('bad');
                $('#errPN').html('Wrong format for Password (NEW)');
            }
            else{
                $(this).removeClass('bad');
                $('#errPN').html('');
            }
        }
    });

    $('#passUpOld').blur(function(){
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad');
            $('#errPO').html('');
        }
        else{
            $passRe = /[\w\d\W\D\s]{5,}/;

            if(!$passRe.test($(this).val())){
                $(this).addClass('bad');
                $('#errPO').html('Wrong format for Password (OLD)');
            }
            else{
                $(this).removeClass('bad');
                $('#errPO').html('');
            }
        }
    });

    $('#emailUp').blur(function(){
        if($(this).val().trim()==""){
            $(this).val("");
            $(this).removeClass('bad');
            $('#errM').html('');
        }
        else{
            $mailRe = /^[A-z\d]{2,}(\.?(\W\D)?[A-z\d]{2,})*\@\w{2,}(\.\w{2,})*$/;

            if(!$mailRe.test($(this).val())){
                $(this).addClass('bad');
                $('#errM').html('Wrong format for E-mail');;
            }
            else{
                $(this).removeClass('bad');
                $('#errM').html('');
            }
        }
    });

    $('#userUp input').keyup(function(e){
        if(e.keyCode===13)
            $('#uppU').click();
    });
    
    /********** VALIDATION FUNCTIONS ***********/
    
    function checkUsername(obj){
        $user = obj;
        $userRe = /^[A-z][a-z]{2}[\da-z]{0,7}$/;

        if(!$userRe.test($user.val())){
            $user.addClass('bad');
            $user.next().removeClass('hidden').html('Wrong format for username');
            return false;
        }
        else{
            $user.removeClass('bad');
            $user.next().addClass('hidden');
            return true;
        }
    }

    function checkPass(obj){
        $pass = obj;
        $passRe = /[\w\d\W\D\s]{5,}/;

        if(!$passRe.test($pass.val())){
            $pass.addClass('bad');
            $pass.next().removeClass('hidden').html('Wrong format for password');
            return false;
        }
        else{
            $pass.removeClass('bad');
            $pass.next().addClass('hidden');
            return true;
        }
    }

    function checkEmail(){
        $mail = $('#emailReg');
        $mailRe = /^[A-z\d]{2,}(\.?(\W\D)?[A-z\d]{2,})*\@\w{2,}(\.\w{2,})*$/;

        if(!$mailRe.test($mail.val())){
            $mail.addClass('bad');
            $mail.next().removeClass('hidden').html('Wrong format for e-mail');
            return false;
        }
        else{
            $mail.removeClass('bad');
            $mail.next().addClass('hidden');
            return true;
        }
    }

    /***************** LOGOUT **********************/

    $('.logout').click(function(){
        logOut();
    })

    function logOut(){
        $.ajax({
            url: 'pages/logout.php',
            method: 'post',
            success: function(){
                location.reload(true);
            }
        })
    }

    /***************  PROFILE ***********************/

    $('#Heading').click(function(){
        $(this).addClass('active');
        $('#profile').addClass('active');
    });

    $('#closeProfile').click(function(){
        $('#Heading').removeClass('active');
        $('#profile').removeClass('active');
    });


    /********************* NEW ENTRY *************************/

    $('.newEn').click(function(){
        $('#newEn').addClass('no');

        var html=`
        <form id='formNew' name='formNew' onsubmit='return checkInsert()' method='POST' action='pages/entryInsert.php' enctype="multipart/form-data">
            <input id="newHead" class='head' type="text" name="newHead" placeholder='Heading' autocomplete="off" />
            <textarea id='newText' class='text' name='newText' placeholder='Type something...'></textarea>
            <input id='imgFile' name='imgFile' type='file' accept="image/*" />
            <i class='fileUpload fas gradientText fa-camera'></i>
            <button type='submit' id='subNew' name='subNew'><i id="save" class="far fa-save"></i></button>
        </form>`;
        $('#Entry').html(html);
        $('.head').focus();

        /*** ON BLUR TRIM ***/
        $('#newHead').blur(function(){
            $(this).val($('#newHead').val().trim());
        });

        $('#newText').blur(function(){
            $(this).val($('#newText').val().trim());
        })

        /*** IMAGE UPLOAD CHECK ***/

        $('#imgFile').change(function() {
            if($(this).val().length){
                $('.fileUpload').addClass('uploaded');
            }
            else{
                $('.fileUpload').removeClass('uploaded');
            }
        });

        setTimeout(function(){
            $('#Entry').addClass('show');
        },800);
    });

    /********************************** Insert new entry **************************************/

    // Either this way or remove from document.ready -  onsubmit doesn't see it here
    window.checkInsert = function(){
        if($('#newHead').val().trim() == '' && $('#newText').val().trim()=='')
            return false;

        return true;
    };

    /*** Insert message fade ***/
    window.fadeInsert = function(){
        //Removing parametar from url
        window.history.replaceState('',document.title,((window.location.href).split('?'))[0]);
        
        setTimeout(function(){
            $('.inserting').fadeOut();
        },2500);
    }

    fadeInsert();

    /*********************************************** FOLDER *****************************************************/

    $('.folder').click(function(){
        getAllEntries();

        setTimeout(function(){
            $('#menu').click();
        }, 500);

        $pillars = $('.pillar');

        for(let p=0; p<$pillars.length; p++){
            setTimeout(function(){
                $($pillars[p]).addClass('show');
            },100*p)
        }

        setTimeout(function(){
            $('#allEn').addClass('show');
            $('.closeAll').addClass('show');
            $('#pagination').fadeIn();
        }, 1500);

    });


    $('.closeAll').click(function(){
        $pillars = $('.pillar');

        $('#allEn').removeClass('show');
        $('.closeAll').removeClass('show');
        $('#pagination').fadeOut();
        
        setTimeout(function(){
            for(let p=0; p<$pillars.length; p++){
                setTimeout(function(){
                    $($pillars[p]).addClass('hide');
                },100*p)
            }
        },500);

        setTimeout(function(){
             $('.pillar').removeClass('hide').removeClass('show');
        },2000);
    });

    /***************************************** LOAD ENTRY ***********************************************/

    function getAllEntries(){
        $.ajax({
            url: 'pages/getEntries.php',
            method: 'GET',
            datatype: 'json',
            success: function(data){
                data = data.sort(function(x,y){
                    if((x.Entered - y.Entered)>0)return -1;
                    if((x.Entered - y.Entered)<0)return 1;
                    return 0;
                });

                if(data.length>0)
                    paginate(data);
                else
                    document.querySelector('#allEn').innerHTML = `<p class='noEn'>No Entries to show</p>`;
            },
            error: function(xhr, status, error){
                console.log(error);
            }
        });
    }

    function listEntries(data){
        let html=``;
        console.log(data);

        for(x of data){
            let enter = calcTime(x.Entered);
            let mod = calcTime(x.LastModified);
            
            html += `
            <div class='oneEnt' data-id='${x.EntryID}'>
                <p class='entryDate'>Entered: <strong>` + enter +`</strong></p>
                <p class='entryDate lm'>Last Modified: <strong>` + mod +`</strong></p>
                <p class='entryHead'>${x.Heading}</p>`;
            if(x.Src != null && x.Src != ''){
                html += `<img class='entryImg' src='`+(x.Src).split('../')[1]+`' alt='`+(x.OldName).split('.')[0]+`'></div>`;
            }
            else 
                html += `</div>`;
        }

        document.querySelector('#allEn').innerHTML = html;
        loadEntry(data);
    }

    function paginate(data){
        let pg = ``;

        var pages= Math.ceil(data.length/4);

        for(let i=0; i<pages; i++){
            pg += `<span class='page page`+(i+1)+`' data-number='`+i+`'>`+(i+1)+`</span>`
        }
        document.querySelector('#pagination').innerHTML = pg;

        pageClick(data);
        $('.page1').click();
    }

    function pageClick(data){
        $('.page').click(function(){
            $('.page').removeClass('active');
            $(this).addClass('active');
            
            var num = $(this).data('number');
            var start = num*4;
            var end = num * 4 + 3;

            var display = [];

            for(let i=start; i<=end; i++){
                if(data[i])
                    display.push(data[i]);
            }

            listEntries(display);
        })
    }

    function calcTime(x){
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        console.log(x);
        var en = new Date(((x/3600)*1000)-432000000); // Mora ovako zbog serverskog vremena 000webhost --> -120h
        var year = en.getFullYear();
        var month = months[en.getMonth()];
        var date = en.getDate();
        var time = date + ' ' + month + ' ' + year;

        return time;
    }

    function loadEntry(data){
        $('.oneEnt').click(function(){
            $('.newEn').click();
            $('.closeAll').click();

            var hidId = $(this).data('id');

            for(x of data){
                if(x.EntryID == hidId){
                    var head = x.Heading;
                    var text = x.Text;
                    if(x.Src != null && x.Src != ''){
                        var src = (x.Src).split('../')[1];
                        var alt = (x.OldName).split('.')[0];
                    }
                }
            }

            var html=`
            <form id='formUp' name='formUp' onsubmit='return checkUpdate()' method='POST' action='pages/entryUpdate.php' enctype="multipart/form-data">
                <input id="upHead" class='head' type="text" name="upHead" placeholder='Heading' autocomplete="off" value='`+head+`'/>
                <textarea id='upText' class='text' name='upText' placeholder='Type something...'>`+text+`</textarea>
                <input id='imgFile' class='camUp' name='imgFile' type='file' accept="image/*" />
                <i class='fileUpload fas gradientText fa-camera camUp'></i>
                <button type='submit' id='subUp' name='subUp'><i id="update" class="fas fa-check"></i></button>
                <i id='delete' class="fas fa-trash-alt"></i>
                <input type='hidden' id='hiddenId' name='hiddenId' value='`+hidId+`'/>
            </form>`

            if(src)
                html += `<i class="pic gradientText fas fa-image"></i>
                         <div id='imageHold'><img src='`+src+`' alt='`+alt+`' /></div>`;
        
            $('#Entry').html(html);
            $('.head').focus();

            /**************** SHOW IMAGE ********************/
            $('.pic').click(function(){
                $('#Entry').css('z-index','9999');
                $('#imageHold').addClass('show');
            });

            $('#imageHold').click(function(){
                $('#Entry').removeAttr("style");
                $(this).removeClass('show');
            });

            /******************************** DELETE ENTRY ************************************/

            $('#delete').click(function(){

                $.ajax({
                    url: 'pages/deleteEntry.php',
                    method: 'POST',
                    data: {
                        eid: $('#hiddenId').val()
                    },
                    datatype: 'json',
                    success: function(data){
                        if(data.ok==1)
                            window.location.href += '?delete=1';
                    },
                    error: function(xhr, status,error){
                        console.log(status);
                        console.log(error);
                    }
                });
            });

            /*** IMAGE UPLOAD CHECK ***/

            $('#imgFile').change(function() {
                if($(this).val().length){
                    $('.fileUpload').addClass('uploaded');
                }
                else{
                    $('.fileUpload').removeClass('uploaded');
                }
            });

        });
    }

    window.checkUpdate = function(){
        if($('#upHead').val().trim() == '' && $('#upText').val().trim()=='')
            return false;

        return true;
    };

});


// 00webhost hiding ///

// $(document).ready(function(){
// 	$("body div:last").css("display","none");
// });