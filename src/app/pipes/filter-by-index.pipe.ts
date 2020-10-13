import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'filterByIndex'
})

export class FilterByIndexPipe implements PipeTransform {

    transform(items: any, array?){
        if(!items){
            return ([]);
        }
        
     
     return array.filter((d, i) => {
         
        if(d.tag === items && i <3)
            {
            return true
            }
        }
        )
            
     
        
    }

}