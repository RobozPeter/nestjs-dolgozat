import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {NewDtoFoglalas} from './data.dto'
import { Response } from 'express';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  
  @Get('/felvetel')
  @Render('foglalas')
  getFelvetel(){
    return {
      errors: [],
      newfoglalas: []
    }
  }

  @Get('/sikerolda')
  @Render('success')
  getsuccess(){
    return{
      newfoglalas: []
    }
  }

  @Post('/felvetel')
  postFelvetel(@Body() newfoglalas: NewDtoFoglalas, @Res() response: Response){

    let errors : string[] = []
    if(!newfoglalas.name||!newfoglalas.email||!newfoglalas.dateandtime||!newfoglalas.watchersOrGuests){
      errors.push("Minden mezőt ki kell tölteni");
    }
    if(!/\w@\w/.test(newfoglalas.email)){
      errors.push("rossz email formátum")
    }
    if(Date.parse(newfoglalas.dateandtime)<Date.now()){
      errors.push("Ennél későbbi időpont kell")
    }
    if(newfoglalas.watchersOrGuests<1||newfoglalas.watchersOrGuests>10){
      errors.push("Az emberszámnak 1 és 10 között kell lennie")
    }

    if(errors.length>0){
      response.render('foglalas',{errors,newfoglalas})
      return;
    }
    else{
      response.render('success',{newfoglalas})
    }
  }
}
