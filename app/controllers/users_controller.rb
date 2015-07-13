class UsersController < ApplicationController
  def index
    respond_to do |format|
      format.html { render 'templates/users' }
      format.json { render json: {} }
    end
  end
end
