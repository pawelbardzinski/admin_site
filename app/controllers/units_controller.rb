class UnitsController < ApplicationController
  def show
    respond_to do |format|
      format.html { render 'templates/unit' }
      format.json { render json: {} }
    end
  end

end
