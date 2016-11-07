'use strict';

angular.module('dweAdminApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Upload, $window) {
    console.log(Auth.getCurrentUser().name);
    
    console.log('admin-view');
    var vm = this;
    vm.contents = [];
    vm.images = [];
    vm.imgDescription = [];
    vm.videoPath = [];
    vm.accordion=1;
    vm.imgJSON = [];
    // console.log(vm.imgJSON);
    var flag=0;
    var demourl = 'http://localhost:9000/server/temp/'

    $http.get('/api/contents').success(function(contents) {
      vm.contents = contents;
      console.log(vm.contents);
      console.log(vm.contents[0]._id);
      vm.title = vm.contents[0].title;
      vm.data = vm.contents[0].textContent;
      var my = vm.contents[0].imageContent.split(",");
      console.log(my);
      vm.images= my;
     console.log(vm.images);

      var me = vm.contents[0].videoContent.split(",");
      console.log(me);
      vm.videoPath= me;
     console.log(vm.videoPath);

     vm.imgJSON = vm.contents[0].imgDescription;
     console.log(vm.imgJSON);
    });

    

    vm.accordianFunction = function(id){
        if(id == 1)
        {
            vm.showHeading = !vm.showHeading;
            if(vm.showHeading && vm.showTextContent){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showHeading && vm.showImagePart){
                vm.showImagePart = !vm.showImagePart;
            }
            if(vm.showHeading && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 2)
        {
            vm.showTextContent = !vm.showTextContent;
            if(vm.showHeading && vm.showTextContent){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showImagePart){
                vm.showImagePart = !vm.showImagePart;
            }
            if(vm.showTextContent && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 3)
        {
            vm.showImagePart = !vm.showImagePart;
            if(vm.showHeading && vm.showImagePart){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showImagePart){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showImagePart && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 4)
        {
            vm.showVideoPart = !vm.showVideoPart;
            if(vm.showHeading && vm.showVideoPart){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showVideoPart){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showImagePart && vm.showVideoPart){
                vm.showImagePart = !vm.showImagePart;
            }
        }
    };

    vm.uploadTitle = function(head)
    {
       var blogTitle = CKEDITOR.instances.blogTitle.getData();
       console.log(blogTitle);
       if(vm.contents.length == 0){
         $http.post('/api/contents', {title: blogTitle}).success(function(res){
                alert("Title Successfully Uploaded");
        });;
       }
       else{
       $http.put('/api/contents/' + vm.contents[0]._id, {title: blogTitle}).success(function(res){
                alert("Data Successfully Uploaded");
      });
   }
    };

    vm.uploadData = function(head)
    {
       var blogData = CKEDITOR.instances.blogData.getData();
       console.log(blogData);
      
       $http.put('/api/contents/' + vm.contents[0]._id, {textContent: blogData}).success(function(res){
                alert("Data Successfully Uploaded");
      });
   
    };

    vm.submit = function(contentType){
        console.log('submit', contentType);
        vm.imUploadProgress = 0;
        vm.progressText1 = 0;
        if (vm.file) 
        {
            console.log('valid', contentType);
            vm.upload(vm.file, contentType); 
        }
    };

    vm.upload = function(file, contentType){
      Upload.upload({
            url: '/api/contents/imageFile', 
            data:{file:file} 
        }).then(function (resp) { 
            console.log(contentType);
            if(resp.data.error_code === 0){ 
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                if(contentType == 1)
                {
                     
                $http({
                    method: 'GET',
                    url: 'http://localhost:9000/api/contents'
                }).then(function successCallback(response)
                    {
                        console.log(response.data[0].imageContent);
                        var my = response.data[0].imageContent.split(",");
                        console.log(my);
                        vm.images= my;
                        console.log(vm.images);
                    }, function errorCallback(error)
                    {
                        console.log('error');
                    });
                   
                    console.log(resp.config.data.file.name);
                    name = resp.config.data.file.name;
                    console.log(demourl + name);
                    vm.images.push(demourl+name);
                    console.log(vm.images);
                    
                    $http.put('/api/contents/' + vm.contents[0]._id, {imageContent: vm.images}).success(function(res){
                         alert("Data Successfully Uploaded");
                    });
                } 

                if(contentType == 2)
                {
                    console.log('videoName', resp.config.data.file.name);
                    name = resp.config.data.file.name;
                    console.log(demourl + name);
                    vm.videoPath.push(demourl+name);
                    console.log(vm.videoPath);
                     $http.put('/api/contents/' + vm.contents[0]._id, {videoContent: vm.videoPath}).success(function(res){
                         alert("Data Successfully Uploaded");
                    });
                }
            } 
        }, function (resp) 
            { 
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                
                if(contentType == 1)
                {
                    console.log('1');
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    vm.imUploadProgress = progressPercentage;
                    vm.progressText1 = 'progress: ' + progressPercentage + '% ';
                }

                if(contentType == 2)
                {
                    console.log("2");
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    vm.vidUploadProgress = progressPercentage;
                    vm.progressText2 = 'progress: ' + progressPercentage + '% ';
                }            
            });
    };





 vm.addDescription = function(description, index){
        
            $http({
                    method: 'GET',
                    url: 'http://localhost:9000/api/contents'
                }).then(function successCallback(response)
                    {
                        console.log(response.data[0].imgDescription);
                     
                        vm.imgJSON= response.data[0].imgDescription;




        console.log('index', index);
        console.log('description', description)
        //vm.imgDescription[index] = description;
       //vm.imgDescription[index] = vm.images[index] + '.txt';
      var tempItem = {};
       
     
     
       
            for(var i=0; i<vm.imgJSON.length; i++){
                console.log('Searching if ID Exists');
                flag=0;
                if(vm.imgJSON[i].id == index)
                {
                    flag=1;
                    console.log('i',i);
                    console.log('id', index);
                    console.log('ID Exists');
                    vm.imgJSON[i].description = description;
                    break;
                }
            }
       
                
                
                
                if(flag == 0 )
                {
                    console.log('flag', flag);
                    console.log('ID Not found. Creating new');
                    
                    console.log('i',i);
                    console.log('id', index);
                    tempItem['id'] = index;
                    tempItem['description'] = description;
                    vm.imgJSON.push(tempItem);
                }
            
       
    
       console.log('json-length', vm.imgJSON);

        
        // console.log(vm.imgDescription);
        // for (desc in vm.imgDescription){
        //     console.log(desc + ':' + vm.imgDescription[desc]);
        // }

        // $http({
        //     method: 'GET',
        //     url: 'http://localhost:3000/uploadImageDescription?imgDescription=' + vm.imgDescription 
        // });
        //console.log('Descriptions', vm.desription);
      

       $http.put('/api/contents/' + vm.contents[0]._id, { imgDescription:   vm.imgJSON  }).success(function(res){
                         alert("Data Successfully Uploaded");
                    });


                       
                    }, function errorCallback(error)
                    {
                        console.log('error');
                    });



}




});
