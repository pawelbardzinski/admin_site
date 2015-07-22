class FacilitiesController < ApplicationController
  def index
  end

  def facility
    respond_to do |format|
      format.html { render 'templates/facility' }
      format.json { render json: {} }
    end
  end
end
