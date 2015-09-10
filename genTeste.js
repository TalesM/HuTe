define( [
	'stache!teste'
], function (
	templateTeste
) {
	var $pages = $('#pages');
	var id = 1;
	var templateHtml = null;
	if(window.sessionStorage['test']){
		importObject(JSON.parse(window.sessionStorage['test']));
	}
	backupSaver();

	$('.jAddpage').click(function(event) {
		require(['stache!page'], function (page) {
			$pages.append(page({id: id++}));
		});
	});
	$pages.on('click', '.jAddpage', function() {
		var $this = $(this);
		require(['stache!page'], function (page) {
			$this.closest('.page').before(page({id: id++}));
		});
	});
	$pages.on('click', '.jRemovepage', function() {
		if(!confirm('Deseja Realmente excluir?')){
			return;
		}
		var $this = $(this);
		var $page = $this.closest('.page');
		$page.hide('slow', function() {
			$page.remove();
		});
	});
	$pages.on('click', '.jUppage', function() {
		var $this = $(this);
		var $page = $(this).closest('.page');
		var $prev = $page.prev('.page');
		if($prev.length){
			$prev.before($page.detach());
			$(document).scrollTop($page.offset().top);
		}
	});
	$pages.on('click', '.jDownpage', function() {
		var $this = $(this);
		var $page = $(this).closest('.page');
		var $next = $page.next('.page');
		if($next.length){
			$next.after($page.detach());
			$(document).scrollTop($page.offset().top);
		}
	});
	$pages.on('click', '.jAddtest', function() {
		var $this = $(this);
		require(['stache!test'], function (test) {
			var testHtml = test({test: id++});
			var $test = $this.closest('.test');
			if($test.length){
				$test.before(testHtml);
			} else {
				var $tests = $this.closest('.page').find('.tests');
				$tests.append(testHtml);
			}
		});
	});

	$pages.on('click', '.jRemovetest', function() {
		if(!confirm('Deseja Realmente excluir?')){
			return;
		}
		var $this = $(this);
		var $test = $this.closest('.test');
		$test.hide('slow', function() {
			$test.remove();
		});
	});


	$pages.on('click', '.jUptest', function() {
		var $this = $(this);
		var $test = $(this).closest('.test');
		var $prev = $test.prev('.test');
		if($prev.length){
			$prev.before($test.detach());
			$(document).scrollTop($test.offset().top);
		}
	});


	$pages.on('click', '.jDowntest', function() {
		var $this = $(this);
		var $test = $(this).closest('.test');
		var $next = $test.next('.test');
		if($next.length){
			$next.after($test.detach());
			$(document).scrollTop($test.offset().top);
		}
	});

	$('.jExportHTML').click(function() {
		var suite = exportObject();
		var blob = new Blob( [templateTeste(suite)], {type: 'text/html'} );
		this.href = URL.createObjectURL(blob);
		this.download = 'teste'+suite.suite+new Date().toISOString()+'.html';
	});

	$('.jExportJSON').click(function() {
		var suite = exportObject();
		var blob = new Blob( [JSON.stringify(suite)], {type: 'application/json'} );
		this.href = URL.createObjectURL(blob);
		this.download = 'test'+suite.suite+new Date().toISOString()+'.json';
	});
	$('.jImportJSON').click(function() {
		$('#fileInput').click();
	});
	$('.jClear').click(function() {
		if(!confirm('Deseja mesmo eliminar todas as informacoes atuais?')){
			return;
		}
		clear();
	});
	$('#fileInput').change(function(event) {
		clear();
		var file = this.files[0];
		if(!file){
			return;
		}
		var reader = new FileReader();
		reader.onload = function (e) {
			var json = JSON.parse(e.target.result);
			importObject(json)
		};
		reader.readAsText(file);
	});
	$(document).keydown(function(event) {
		if(event.ctrlKey){
			switch(event.which){
			case 79:
				$('.jImportJSON').click();
				return false;
			case 83:
				$('.jExportJSON').click();
				return false;
			default:
				return true;
			}
		}
	});

	function importObject(obj) {
		$('#suite').val(obj.suite);
		var pages = obj.pages.map(function(page, id) {
			return {
				id: id,
				target: page.target||'',
				comment: page.comment||'',
				tests: page.tests.map(function(test, ind) {
					return {
						test: id+'_'+ind,
						conditions: test.conditions.join('\n\n'),
						procedures: test.procedures.join('\n\n'),
						expected: test.expected
					};
				})||[]
			}
		});
		id = pages.length;
		require(['stache!page'], function (page) {
			$pages.append(page(pages));
		});
	}

	function exportObject(){
		return {
			suite: $('#suite').val(),
			pages:$('.page').map(function(ind, page) {
				var $page = $(this);
				return {
					target: $page.find('.target').val(),
					comment: $page.find('.comment').val(),
					tests: $page.find('.test').map(function(ind, test) {
						var $test = $(this);
						var conditions = $test.find('.conditions').val() || '';
						var procedures = $test.find('.procedures').val() || '';
						var expected = $test.find('.expected').val() || '';
						function filterEmpties (str) {
							return str.trim();
						}
						return {
							conditions: conditions.split('\n\n').filter(filterEmpties),
							procedures: procedures.split('\n\n').filter(filterEmpties),
							expected: expected
						};
					}).get(),
				};
			}).get(),
		};
	}
	function clear(){
		$('#pages > div').remove();
		$('#suite').val('');
	}
	function backupSaver() {
		window.sessionStorage['test'] = JSON.stringify(exportObject());
		setTimeout(backupSaver, 1000);
	}
} );