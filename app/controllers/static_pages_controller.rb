class StaticPagesController < ApplicationController

  def stats
    respond_to do |format|
      format.html { render 'templates/stats' }
      format.json { render json: {} }
    end
  end

end
