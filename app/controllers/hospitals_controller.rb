class HospitalsController < ApplicationController

  def index
    respond_to do |format|
      format.html { render 'templates/home' }
      format.json { render json: {} }
    end
  end
end
