class FacilitiesController < ApplicationController
  def index
    respond_to do |format|
      format.html { render 'templates/facilities' }
      format.json { render json: {} }
    end
  end

  def facility
    respond_to do |format|
      format.html { render 'templates/facility' }
      format.json { render json: {} }
    end
  end
end
