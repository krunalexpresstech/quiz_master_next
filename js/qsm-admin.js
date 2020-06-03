/**
 * QSM - Quizzes/Surveys Page
 */

var QSMQuizzesSurveys;
(function ($) {
	QSMQuizzesSurveys = {
		load: function() {
			if ( 0 !== qsmQuizObject.length ) {
				$.each( qsmQuizObject, function( i, val ) {
					QSMQuizzesSurveys.addQuizRow( val );
				});
				$( '#the-list tr' ).filter( ':even' ).addClass( 'alternate' );
			} else {
				var template = wp.template( 'no-quiz' );
				$( '.qsm-quizzes-page-content' ).hide();
				$( '#new_quiz_button' ).parent().after( template() );
			}
		},
    addQuizRow: function( quizData ) {
      var template = wp.template( 'quiz-row' );
      var values = {
        'id': quizData.id,
        'name': quizData.name,
        'link': quizData.link,
        'postID': quizData.postID,
        'views': quizData.views,
        'taken': quizData.taken,
        'lastActivity': quizData.lastActivity,
        'lastActivityDateTime': quizData.lastActivityDateTime,
        'post_status' : quizData.post_status != 'publish' ? '— ' + quizData.post_status : ''
      };
      var row = $( template( values ) );
      $( '#the-list' ).append( row );
    },
    searchQuizzes: function( query ) {
      $( ".qsm-quiz-row" ).each(function() {
        if ( -1 === $( this ).find( '.row-title' ).text().toLowerCase().indexOf( query.toLowerCase() ) ) {
          $( this ).hide();
        } else {
          $( this ).show();
        }
      });
    },
    deleteQuiz: function( quiz_id ) {
      $( '#delete_quiz_id' ).val( quiz_id );
      $.each( qsmQuizObject, function( i, val ) {
        if ( val.id == quiz_id ) {
          $( '#delete_quiz_name' ).val( val.name );
        }
      });
      MicroModal.show( 'modal-5' );
    },
    editQuizName: function( quiz_id ) {
      $( '#edit_quiz_id' ).val( quiz_id );
      $.each( qsmQuizObject, function( i, val ) {
        if ( val.id == quiz_id ) {
          $( '#edit_quiz_name' ).val( val.name );
        }
      });
      MicroModal.show( 'modal-3' );
    },
    duplicateQuiz: function( quiz_id ) {
      $( '#duplicate_quiz_id' ).val( quiz_id );
      MicroModal.show( 'modal-4' );
    },
    /**
     * Opens the popup to reset quiz stats
     *
     * @param int The ID of the quiz
     */
    openResetPopup: function( quiz_id ) {
      quiz_id = parseInt( quiz_id );
      $( '#reset_quiz_id' ).val( quiz_id );
      MicroModal.show( 'modal-1' );
    },
  };
  $(function() {
    $( '#new_quiz_button_two' ).on( 'click', function( event ) {
      event.preventDefault();
      MicroModal.show( 'modal-2' );
    });
    $( '#new_quiz_button' ).on( 'click', function( e ) {
        e.preventDefault();            
        MicroModal.show('model-wizard');
        var height = jQuery(".qsm-wizard-template-section").css("height");
        jQuery(".qsm-wizard-setting-section").css("height", height);
        if(jQuery( "#accordion" ).length > 0){
            var icons = {
                header: "iconClosed",    // custom icon class
                activeHeader: "iconOpen" // custom icon class
            };
            jQuery( "#accordion" ).accordion({
                    collapsible: true,
                    icons: icons,
                    heightStyle: "content"
            });
            jQuery('.template-list .template-list-inner:first-child').trigger('click');                
        }
    });
    //Get quiz options
    $('.template-list-inner').click(function(){
        var action = 'qsm_wizard_template_quiz_options';
        var settings = $(this).data('settings');
        var addons = $(this).data('addons');
        $('.template-list .template-list-inner').removeClass('selected-quiz-template');
        $(this).addClass('selected-quiz-template');
        $.post(ajaxurl, {settings: settings, addons: addons, action: action },
            function (data) {
                var diff_html = data.split('=====');                    
                $('#quiz_settings_wrapper').html('');      
                $('#quiz_settings_wrapper').html(diff_html[0]);
                $('#recomm_addons_wrapper').html('');
                $('#recomm_addons_wrapper').html(diff_html[1]);
                $( "#accordion" ).accordion();
            }
        );
    });
    $( '#show_import_export_popup' ).on( 'click', function( event ) {
        event.preventDefault();
        MicroModal.show( 'modal-export-import' );
    });
    /*$( '#quiz_search' ).keyup( function() {
      QSMQuizzesSurveys.searchQuizzes( $( this ).val() );
    });*/
    $( document ).on( 'click', '#the-list .qsm-action-link-delete', function( event ) {
      event.preventDefault();
      QSMQuizzesSurveys.deleteQuiz( $( this ).parents( '.qsm-quiz-row' ).data( 'id' ) );
    });
    $( document ).on( 'click', '#the-list .qsm-action-link-duplicate', function( event ) {
      event.preventDefault();
      QSMQuizzesSurveys.duplicateQuiz( $( this ).parents( '.qsm-quiz-row' ).data( 'id' ) );
    });
    $( document ).on( 'click', '#the-list .qsm-edit-name', function( event ) {
      event.preventDefault();
      QSMQuizzesSurveys.editQuizName( $( this ).parents( '.qsm-quiz-row' ).data( 'id' ) );
    });
    $( document ).on( 'click', '#the-list .qsm-action-link-reset', function( event ) {
      event.preventDefault();
      QSMQuizzesSurveys.openResetPopup( $( this ).parents( '.qsm-quiz-row' ).data( 'id' ) );
    });
    $( '#reset-stats-button' ).on( 'click', function( event ) {
      event.preventDefault();
      $( '#reset_quiz_form' ).submit();
    });
    $( '#create-quiz-button' ).on( 'click', function( event ) {
      event.preventDefault();
      $( '#new-quiz-form' ).submit();
    });
    $( '#duplicate-quiz-button' ).on( 'click', function( event ) {
      event.preventDefault();
      $( '#duplicate-quiz-form' ).submit();
    });
    $( '#delete-quiz-button' ).on( 'click', function( event ) {
      event.preventDefault();
      $( '#delete-quiz-form' ).submit();
    });
    //QSMQuizzesSurveys.load();
    $(document).on('click','.sc-opener',function(){ 
        var $this = $(this);
        var shortcode_text = $this.next('.sc-content').text();
        $('#sc-shortcode-model-text').val(shortcode_text);
        MicroModal.show( 'modal-6' );        
    });
    $(document).on('click','#sc-copy-shortcode', function(){
        
        var copyText = document.getElementById("sc-shortcode-model-text");
        
        copyText.select();
        /* Copy the text inside the text field */
        document.execCommand("copy");
        
    });
  });
}(jQuery));
