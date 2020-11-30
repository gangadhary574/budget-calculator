var john = {
    name: 'john',
    yearOfBirth: 1990,
    calculateAge: function(){
        var age = 2020-this.yearOfBirth;
        var self = this;
        console.log('this is inside calculateAge: '+ this.yearOfBirth);
        console.log(this);
        return function(){
            console.log(this);
            
            if (age> 18){
                console.log(self.name+' is an adult. He is '+ age +" years old."); 
            }
            else{
                console.log( self.name+ ' is not an adult.');
            }
        }
    }
}

john.calculateAge()();

var mike ={
    name: 'Mike',
    yearOfBirth: 2006,

}
mike.calculateAge = john.calculateAge;

mike.calculateAge()();