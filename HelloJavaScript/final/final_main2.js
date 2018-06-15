function main()
{
    //値は10~200の範囲でとる
    var volume = new KVS.CreateHydrogenData(60, 60, 60);
    //var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();
    var mesh;
    var surfaces;
    var count = 0;

    //スクリーンの初期化
    screen.init(volume, {
    	width: window.innerWidth * 0.8,
    	height: window.innerHeight,
    	targetDom: document.getElementById('display'),
    	enableAutoResize: false
    });
    setup();
    screen.loop();

    //以下が実際の操作に関わる部分
    function setup()
    {
    	//volumeを入れる箱の設定
        var color = new KVS.Vec3( 0, 0, 0 );
    	var box = new KVS.BoundingBox();
    	box.setColor( color );
    	box.setWidth( 1 );

        //isovalueの初期設定
    	var smin = volume.min_value;
    	var smax = volume.max_value;
    	var isovalue = KVS.Mix( smin, smax, 0.5 );
    	var isosurface = new KVS.Isosurface();
    	isosurface.setIsovalue( isovalue );

    	document.getElementById('label_isovalue').innerHTML = "Isovalue: " + Math.round( isovalue );

        //sizeの初期設定
        var dimx = 10;
        var dimy = 10;
        var dimz = 10;
        document.getElementById('label_size_x').innerHTML = "dimx: " + dimx;
        document.getElementById('label_size_y').innerHTML = "dimy: " + dimy;
        document.getElementById('label_size_z').innerHTML = "dimz: " + dimz;


    	//volumeの初期設定
        var line = KVS.ToTHREELine( box.exec( volume ) );
    	mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) , new THREE.MeshLambertMaterial);
    	screen.scene.add( line );
    	screen.scene.add( mesh );

        //isovalueのスライドバー
    	document.getElementById('isovalue').addEventListener('mousemove', function() {
    		var value = +document.getElementById('isovalue').value;
    		var isovalue = KVS.Mix( smin, smax, value );
    		document.getElementById('label_isovalue').innerHTML = "Isovalue: " + Math.round( isovalue );
    	});

        //isovalueのapplyボタン
    	document.getElementById('isovalue_button').addEventListener('click', function() {
    		screen.scene.remove( mesh );
    		var value = +document.getElementById('isovalue').value;
    		var isovalue = KVS.Mix( smin, smax, value );
    		var isosurface = new KVS.Isosurface();
    		isosurface.setIsovalue( isovalue );
    		mesh = KVS.ToTHREEMesh( isosurface.exec( volume ), new THREE.MeshLambertMaterial );
    		screen.scene.add( mesh );
    	});

        //lambertのgouraud shading
    	document.getElementById('lambert_gouraud_button').addEventListener('click', function() {
    		screen.scene.remove(mesh);
    		var vert_shader = document.getElementById('lambert_gouraud.vert').text;
    		var frag_shader = document.getElementById('lambert_gouraud.frag').text;
    		var reflection_model = "Lambert";
    		var material = new THREE.ShaderMaterial({
    			vertexColors: THREE.VertexColors,
    			vertexShader: vert_shader,
    			fragmentShader: frag_shader,
    			defines: {
    				Lambert: reflection_model == "Lambert",
    				Phong: reflection_model == "Phong",
    			},
    			uniforms: {
    				light_position: { type: 'v3', value: screen.light.position },
    				camera_position: { type: 'v3', value: screen.camera.position },
    			}
    		});
    		var value = +document.getElementById('isovalue').value;
    		var isovalue = KVS.Mix( smin, smax, value );
    		var isosurface = new KVS.Isosurface();
    		isosurface.setIsovalue(isovalue);
    		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
    		screen.scene.add(mesh);
    	});
	
        //lambertのphone shading
    	// document.getElementById('lambert_phong_button').addEventListener('click', function() {
    	// 	screen.scene.remove(mesh);
    	// 	var vert_shader = document.getElementById('lambert_phong.vert').text;
    	// 	var frag_shader = document.getElementById('lambert_phong.frag').text;
    	// 	var reflection_model = "Lambert";
    	// 	var material = new THREE.ShaderMaterial({
    	// 		vertexColors: THREE.VertexColors,
    	// 		vertexShader: vert_shader,
    	// 		fragmentShader: frag_shader,
    	// 		defines: {
    	// 			Lambert: reflection_model == "Lambert",
    	// 			Phong: reflection_model == "Phong",
    	// 		},
    	// 		uniforms: {
    	// 			light_position: { type: 'v3', value: screen.light.position },
    	// 			camera_position: { type: 'v3', value: screen.camera.position },
    	// 		}
    	// 	});
    	// 	var value = +document.getElementById('isovalue').value;
    	// 	var isovalue = KVS.Mix( smin, smax, value );
    	// 	var isosurface = new KVS.Isosurface();
    	// 	isosurface.setIsovalue(isovalue);
    	// 	mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
    	// 	screen.scene.add(mesh);
    	// });

        //phongのgouraoud shading
    	document.getElementById('phong_gouraud_button').addEventListener('click', function() {
    		screen.scene.remove(mesh);
    		var vert_shader = document.getElementById('phong_gouraud.vert').text;
    		var frag_shader = document.getElementById('phong_gouraud.frag').text;
    		var reflection_model = "Phong";
    		var material = new THREE.ShaderMaterial({
    			vertexColors: THREE.VertexColors,
    			vertexShader: vert_shader,
    			fragmentShader: frag_shader,
    			defines: {
    				Lambert: reflection_model == "Lambert",
    				Phong: reflection_model == "Phong",
    			},
    			uniforms: {
    				light_position: { type: 'v3', value: screen.light.position },
    				camera_position: { type: 'v3', value: screen.camera.position },
    			}
    		});
    		var value = +document.getElementById('isovalue').value;
    		var isovalue = KVS.Mix( smin, smax, value );
    		var isosurface = new KVS.Isosurface();
    		isosurface.setIsovalue(isovalue);
    		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
    		screen.scene.add(mesh);
    	});
	
        //phoneのphone shading
    	// document.getElementById('phong_phong_button').addEventListener('click', function() {
    	// 	screen.scene.remove(mesh);
    	// 	var vert_shader = document.getElementById('phong_phong.vert').text;
    	// 	var frag_shader = document.getElementById('phong_phong.frag').text;
    	// 	var reflection_model = "Phong";
    	// 	var material = new THREE.ShaderMaterial({
    	// 		vertexColors: THREE.VertexColors,
    	// 		vertexShader: vert_shader,
    	// 		fragmentShader: frag_shader,
    	// 		defines: {
    	// 			Lambert: reflection_model == "Lambert",
    	// 			Phong: reflection_model == "Phong",
    	// 		},
    	// 		uniforms: {
    	// 			light_position: { type: 'v3', value: screen.light.position },
    	// 			camera_position: { type: 'v3', value: screen.camera.position },
    	// 		}
    	// 	});
    	// 	var value = +document.getElementById('isovalue').value;
    	// 	var isovalue = KVS.Mix( smin, smax, value );
    	// 	var isosurface = new KVS.Isosurface();
    	// 	isosurface.setIsovalue(isovalue);
    	// 	mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
    	// 	screen.scene.add(mesh);
    	// });

        //dimxのサイズを変える
        document.getElementById('dimx').addEventListener('mousemove', function() {
            var value = +document.getElementById('dimx').value;
            document.getElementById('label_size_x').innerHTML = "dimx: " + value;
        });

        //dimyのサイズを変える
        document.getElementById('dimy').addEventListener('mousemove', function() {
            var value = +document.getElementById('dimy').value;
            document.getElementById('label_size_y').innerHTML = "dimy: " + value;
        });

        //dimzのサイズを変える
        document.getElementById('dimz').addEventListener('mousemove', function() {
            var value = +document.getElementById('dimz').value;
            document.getElementById('label_size_z').innerHTML = "dimz: " + value;
        });

        //dimensionのapplyを行う
        document.getElementById('set_size_button').addEventListener('click', function() {
            screen.scene.remove( line );
            screen.scene.remove( mesh );
            var value_x = +document.getElementById('dimx').value;
            var value_y = +document.getElementById('dimy').value;
            var value_z = +document.getElementById('dimz').value;

            var value = +document.getElementById('isovalue').value;

            volume = new KVS.CreateHydrogenData(value_x, value_y, value_z);
            line = KVS.ToTHREELine( box.exec( volume ) );
            var isovalue = KVS.Mix( smin, smax,  value);
            var isosurface = new KVS.Isosurface();
            isosurface.setIsovalue(isovalue);
            mesh = KVS.ToTHREEMesh( isosurface.exec( volume ), new THREE.MeshLambertMaterial );
            screen.scene.add( line );
            screen.scene.add( mesh );
        });

        //slice planeの抽出を行う
    	document.getElementById('slice_button').addEventListener('click', function() {
            screen.scene.remove(mesh);

            var point = new THREE.Vector3(60, 60, 17);
            var normal = new THREE.Vector3(1, 0, 4);
            surfaces = Isosurfaces(volume, point, normal);
            screen.scene.add(surfaces);

            count = count + 1;

        });

        //色々変更したロブスターの状態を初期状態に戻す
        document.getElementById('clear_button').addEventListener('click', function() {
            //screen.scene.remove(mesh);
            if (count > 0) {
                screen.scene.remove(line);
                screen.scene.remove(surfaces);
            } else if (count == 0) {
                screen.scene.remove(line);
                screen.scene.remove(mesh);
            }

            volume = new KVS.CreateHydrogenData(60, 60, 60);
            line = KVS.ToTHREELine( box.exec( volume ) );
            mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) , new THREE.MeshLambertMaterial);
            screen.scene.add( line );
            screen.scene.add( mesh );
        })

    	document.addEventListener( 'mousemove', function() {
    		screen.light.position.copy( screen.camera.position );
    	});

    	window.addEventListener('resize', function() {
    		screen.resize([	window.innerWidth * 0.8, window.innerHeight ]);
    	});

		screen.draw();
	}
}

