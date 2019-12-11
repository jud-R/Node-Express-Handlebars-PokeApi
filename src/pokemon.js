'use strict';
const fetch= require('node-fetch');

class Pokemon {
  constructor(baseUrl){
    if(!baseUrl) throw new Error('BaseUrl is required');
    this.baseUrl = baseUrl;
  }
  async getData(url){
    const res = await fetch(url);
    return res.json();
  }
  async getPokemon(id=1){
    return this.getData(`${this.baseUrl}/${id}`);
  }
  async getAllPokemon(limit=151){
    return this.getData(`${this.baseUrl}?limit=${limit}`)
  }
}

module.exports = Pokemon;